import { Container } from '@mui/system';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Box, Grid, Typography, List, ListItem, ListItemIcon, Paper } from '@mui/material';
import { setRelays } from '../redux/nostr';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


export default function Relays() {
    const [relayInput, setRelayInput] = useState("");
    const dispatch = useDispatch();
    const relays = useSelector(state => state.nostr.relayList);

    const handleRelayInputChange = (e) => {
        e.preventDefault();
        setRelayInput(e.target.value)
    }

    const AddRelay = () => {
        console.log(relayInput)
        dispatch(setRelays(relayInput))
    }

    const DeleteRalay = (relay) => {
        console.log("Deleting Relay: " + relay);
    }


    return (
        <Container sx={{ width: "50%", justifyContent: "center", alignItems: "center"}}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                Relays
            </Typography>

            <List>
                {relays.map(relay => {
                    return (
                        <Paper sx={{margin: "10px"}}>
                            <ListItem  key={relay}>
                                <Grid container>
                                    <Grid xs={1}>
                                            <ListItemIcon>
                                                <SettingsInputAntennaIcon />
                                            </ListItemIcon>
                                    </Grid>
                                    <Grid xs={10}>
                                        <Typography >
                                            {relay}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={1}>
                                        <Button onClick={() => DeleteRalay(relay)}>
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
                <Button color='secondary' onClick={AddRelay}>Add Relay</Button>
            </Box>
        </Container>
    )
}
