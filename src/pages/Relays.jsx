import { Container } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react'
import { Button, TextField, Box, Grid, Typography, List, ListItem, ListItemIcon, Paper } from '@mui/material';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import toastr from 'toastr';
import { getPublicKey, SimplePool } from 'nostr-tools';
import { useNavigate } from 'react-router';
import { isValidKey } from '../NostrFunctions';

export default function Relays(props) {
    const [relayInput, setRelayInput] = useState("");
    const privateKey = window.localStorage.getItem("localPk");
    const relayList =  props.relays;
    const navigate = useNavigate();
    const pool = useRef(new SimplePool())

    useEffect(() => {
        if (!isValidKey(privateKey)) navigate("/signin", {replace: true});
    })
    
    useEffect(() => {
        const getEvents = async () => {
            let events = await pool.current.list(relayList, [{authors: getPublicKey(privateKey), kinds: [0]}])
            console.log(events)
        }
        getEvents();
    }, [])
    
    const handleRelayInputChange = (e) => {
        e.preventDefault();
        setRelayInput(e.target.value)
    }
    
    const handleAddRelay = () => {
        if (relayInput === ""){
            toastr.error("Please enter a relay url.")
            return;
        }

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
        const deletedRelayList = relayList.filter((r) => r !== relay);
        props.setRelays(deletedRelayList);
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
                helperText="wss://example.com"
                />
                <Button color='secondary' onClick={handleAddRelay}>Add Relay</Button>
                <Button color='warning' onClick={handleAddRelay}>Save Relays Publicly</Button>
            </Box>
        </Container>
    )
}
