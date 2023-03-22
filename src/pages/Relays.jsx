import "./Relays.css";
import React, { useEffect, useRef, useState } from 'react'
import { Button, TextField, Box, Grid, Typography, List, ListItem, ListItemIcon, Paper, styled } from '@mui/material';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import toastr from 'toastr';
import { getEventHash, getPublicKey, signEvent, SimplePool, validateEvent, verifySignature } from 'nostr-tools';
import { useNavigate } from 'react-router';
import { isValidKey } from '../NostrFunctions';

export default function Relays(props) {
    const [relayInput, setRelayInput] = useState("");
    const privateKey = window.localStorage.getItem("localPk");
    const relayList =  props.relays;
    const navigate = useNavigate();
    const pool = new SimplePool();

    useEffect(() => {
        if (!isValidKey(privateKey)) navigate("/signin", {replace: true});
    })
    
    useEffect(() => {
        const getEvents = async () => {
            let currentRelaysEvent = await pool.list(relayList, [{kinds: [10002], authors: [getPublicKey(privateKey)], limit: 1 }])
            console.log(currentRelaysEvent)
            if (currentRelaysEvent[0] && currentRelaysEvent[0].tags.length > 0){
                let eventArray = [];
                currentRelaysEvent[0].tags.forEach((tag) => {
                    if(tag[0] === "r") {
                        eventArray.push(tag[1]);
                    }
                })
                props.setRelays(eventArray)
                console.log("set relays" + eventArray)
            }
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

    const handleSaveRelays = async () => {
        let saveRelayPool = new SimplePool();
        let prevRelays = await saveRelayPool.list(relayList, [{kinds: [10002], authors: [getPublicKey(privateKey)], limit: 1 }])
        console.log("PrevRelays" + prevRelays)

        const newEvent = newRelayEvent()
        console.log(newEvent)

        newEvent.id = getEventHash(newEvent);
        newEvent.sig = signEvent(newEvent, privateKey);
      
        if(!validateEvent(newEvent) || !verifySignature(newEvent)){
          console.log("Event is Invalid")
          return;
        }
        console.log("Event is valid")
      
        let pubs = saveRelayPool.publish(relayList, newEvent);
        console.log("pubs: " + JSON.stringify(pubs));
        
        pubs.on("ok", () => {
          console.log(`Published Event`);
          return "ok";
        })
      
        pubs.on("failed", reason => {
            console.log("failed: " + reason);
            return "failed";
        })
    }
    
    const newRelayEvent = () => {
        let relayTags = [];

        relayList.forEach(relay => {
            relayTags.push(["r", relay])
        });

        return {
            "content": "",
            "created_at": Math.floor(Date.now() / 1000),
            "kind": 10002,
            "pubkey": getPublicKey(privateKey),
            "tags": relayTags
          }
    }

    return (
        <Box id="RelaysBox">
            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                Relays
            </Typography>

            <List>
                {relayList.map(relay => {
                    return (
                        <Paper key={relay} className="relayItem">
                            <ListItem >
                                <Grid container >
                                    <Grid item={true} xs={1}>
                                            <ListItemIcon>
                                                <SettingsInputAntennaIcon />
                                            </ListItemIcon>
                                    </Grid>
                                    <Grid item={true} xs={10} >
                                        <Typography variant="body2" sx={{marginLeft: "7px"}}>
                                            {relay}
                                        </Typography>
                                    </Grid>
                                    <Grid item={true} xs={1} >
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

            <Box id="relayform">
                <TextField
                id="addRelayInput"
                label="New Relay"
                defaultValue=""
                onChange={(e) => handleRelayInputChange(e)}
                helperText="wss://example.com"
                />
                <Button sx={{margin: "5px"}} variant='outlined' color='secondary' onClick={handleAddRelay}>Add Relay</Button>
                <Button sx={{margin: "5px"}} variant='outlined' color='warning' onClick={handleSaveRelays}>Save Relays Publicly</Button>
            </Box>
            </Box>
    )
}
