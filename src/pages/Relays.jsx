import { Container } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react'
import { Button, TextField, Box, Grid, Typography, List, ListItem, ListItemIcon, Paper } from '@mui/material';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import toastr from 'toastr';
import { SimplePool } from 'nostr-tools';
import { useNavigate } from 'react-router';

export default function Relays(props) {
    const [relayInput, setRelayInput] = useState("");
    const privateKey = props.privateKey;
    const relayList =  props.relays;
    const navigate = useNavigate();
    const pool = useRef(new SimplePool())

    useEffect(() => {
        if (!privateKey || privateKey === "") navigate("/signin", {replace: true});
    })

    const handleRelayInputChange = (e) => {
        e.preventDefault();
        setRelayInput(e.target.value)
    }
    
    const handleAddRelay = () => {
        if (relayList.includes(relayInput)){
            toastr.error("Relay already exists.");
            return;
        }
        // props.setRelays([...props.relays, relayInput]);
        // toastr.success("Relay Added.")
    }

    const DeleteRelay = (relay) => {
        // console.log("Deleting Relay: " + relay);
        // if (relayList.length === 1){
        //     toastr.error("Keep at least one relay");
        //     return;
        // }
        // let deletedRelayList = relayList.filter((r) => r !== relay);
        // toastr.success("Relay Removed.")
    }
    
    useEffect(() => {
        // if (pk === "") navigate("/signin", {replace: true});
        // const getEvents = async () => {
        //     let events = await pool.current.list(relayList, [{authors: publicKey, kinds: [0]}])
        //     console.log(events)
        // }
        // getEvents();
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
