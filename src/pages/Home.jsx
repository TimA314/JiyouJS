import {React, useEffect, useState } from 'react'
import ActionAreaCard from '../components/card';
import {
    generatePrivateKey,
    relayInit, 
    getPublicKey,
    SimplePool,
    validateEvent,
    verifySignature,
    signEvent,
    getEventHash
  } from 'nostr-tools'
import { Box } from '@mui/material';

function Home(props) {
    const [events, setEvents ] = useState([]);
    let relays = ['wss://nos.lol', 'wss://relay.damus.io', 'wss://nostr.mom']

    useEffect(()=> {
        async function start(){
            const pool = new SimplePool()
            let events = await pool.list(relays, [{kinds: [1]}])
            setEvents(events);
        }
        start();
    },[]);

    if (events != null){
        
        return (
            <Box>
                {events.map((event) => (
                    <ActionAreaCard key={event.id} event={event} relays={relays}/>
                ))}
            </Box>
        )
    } else {
        return <div>Loading...</div>
    }
}

export default Home