import { Container } from '@mui/system';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, TextField, Box, Grid, Typography, List, ListItem, ListItemIcon, Paper } from '@mui/material';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import toastr from 'toastr';
import { SimplePool } from 'nostr-tools';
import { NostrContext } from '../context/NostrContext';

export default function Relays() {
    const pool = useRef(new SimplePool())
    const [relayInput, setRelayInput] = useState("");
    const privateKey = useContext(NostrContext).privateKey;
    const publicKey = useContext(NostrContext).publicKey;
    const relayList =  useContext(NostrContext).relays;;

    
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
        // props.setRelays([...props.relays, relayInput]);
        // toastr.success("Relay Added.")
    }

    const DeleteRelay = (relay) => {
        console.log("Deleting Relay: " + relay);
        if (relayList.length === 1){
            toastr.error("Keep at least one relay");
            return;
        }
        let deletedRelayList = relayList.filter((r) => r !== relay);
        // props.setRelays([deletedRelayList]);
        toastr.success("Relay Removed.")
    }

    useEffect(() => {
        const getEvents = async () => {
            let events = await pool.current.list(relayList, [{authors: [publicKey], kinds: [0]}])
            console.log(events)
        }
        getEvents();
    
    }, [])
    

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
