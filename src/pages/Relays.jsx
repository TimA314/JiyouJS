import { Container } from '@mui/system';
import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Box, Grid, Typography, List, ListItem, ListItemIcon, Paper, Alert } from '@mui/material';
import { addRelay, removeRelay } from '../redux/nostr';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import toastr from 'toastr';
import { nip05 } from 'nostr-tools';
import { NostrContext } from '../Nostr/NostrContext';


export default function Relays(props) {
    const [relayInput, setRelayInput] = useState("");
    const relayList = props.relays;
    const privateKey = useContext(NostrContext).privateKey;
    const publicKey = useContext(NostrContext).publicKey;

    
    // let profile = await nip05.queryProfile('')
    console.log(privateKey);
    const handleRelayInputChange = (e) => {
        e.preventDefault();
        setRelayInput(e.target.value)
    }

    const handleAddRelay = () => {
        console.log(relayInput)
        if (relayList.includes(relayInput)){
            toastr.error("Relay already exists.");
            return;
        }
        props.setRelays([...props.relays, relayInput]);
        toastr.success("Relay Added.")
    }

    const DeleteRelay = (relay) => {
        console.log("Deleting Relay: " + relay);
        if (relayList.length === 1){
            toastr.error("Keep at least one relay");
            return;
        }
        let deletedRelayList = relayList.filter((r) => r !== relay);
        props.setRelays([deletedRelayList]);
        toastr.success("Relay Removed.")
    }


    return (
        <Container sx={{ width: "50%", justifyContent: "center", alignItems: "center"}}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                Relays
            </Typography>

            <List>
                {relayList.map(relay => {
                    return (
                        <Paper key={relay} sx={{margin: "10px"}}>
                            <ListItem >
                                <Grid container>
                                    <Grid item={true} xs={1}>
                                            <ListItemIcon>
                                                <SettingsInputAntennaIcon />
                                            </ListItemIcon>
                                    </Grid>
                                    <Grid item={true} xs={10}>
                                        <Typography >
                                            {relay}
                                        </Typography>
                                    </Grid>
                                    <Grid item={true} xs={1}>
                                        <Button onClick={() => DeleteRelay(relay)}>
                                            <DeleteForeverIcon /> 
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </Paper>
                    )
                })}
            </List>

            <Box >
                <TextField
                id="addRelayInput"
                label="New Relay"
                defaultValue=""
                onChange={(e) => handleRelayInputChange(e)}
                helperText="wss://"
                />
                <Button color='secondary' onClick={handleAddRelay}>Add Relay</Button>
            </Box>
        </Container>
    )
}
