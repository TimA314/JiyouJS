import { Container } from '@mui/system';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Box } from '@mui/material';
import { setRelays } from '../redux/nostr';


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
        <Container sx={{ width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Box sx={{ margin: '0 auto 16px', width: "100%", justifyContent: "center", alignItems: "center"}}>
                {relays}
            </Box>
            <Box >
                <TextField
                id="addRelayInput"
                label="New Relay"
                defaultValue=""
                onChange={(e) => handleRelayInputChange(e)}
                helperText="wss://relay.damus.io"
                />
                <Button color='secondary' onClick={AddRelay}>Add Relay</Button>
            </Box>
        </Container>
    )
}
