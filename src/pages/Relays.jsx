import { Container } from '@mui/system';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Box, Grid, Typography, List, ListItem, ListItemIcon } from '@mui/material';
import { setRelays } from '../redux/nostr';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';


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

    return (
        <Container sx={{ width: "50%", justifyContent: "center", alignItems: "center"}}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                Relays
            </Typography>

            <List>
                {relays.map(relay => {
                    return (
                        <ListItem  key={relay}>
                            <Grid container>
                                <Grid xs={6}>
                                    <ListItemIcon>
                                        <SettingsInputAntennaIcon />
                                    </ListItemIcon>
                                    <Typography >
                                        {relay}
                                    </Typography>
                                </Grid>
                                <Grid xs>
                                    <Button>
                                        <DeleteForeverIcon /> 
                                    </Button>
                                </Grid>
                            </Grid>
                        </ListItem>
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
