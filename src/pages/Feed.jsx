import {React, useEffect, useState } from 'react';
import ActionAreaCard from '../components/card';
import toastr from 'toastr';
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
import { Box, Button } from '@mui/material';

function Feed(props) {
    const [sk, setSk] = useState(generatePrivateKey());
    const [pk, setPk] = useState(getPublicKey(sk));
    const [relays, setRelays] = useState(['wss://nos.lol']);
    const [events, setEvents ] = useState([]);
    const pool = new SimplePool()

    const connectRelay = async () => {
        let events = await pool.list(relays, [{kinds: [1]}])
        
        setEvents(events);
        
        events.forEach(async event => {
            // console.log(event)
        });
    }

    var newEvent = {
        kind: 1,
        pubkey: pk,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: "Bitcoin"
    }

    newEvent.id = getEventHash(newEvent);
    newEvent.sig = signEvent(newEvent, sk);

    const publishEvent = () => {
        console.log("Event: " + newEvent)
        
        const pubs = pool.publish(relays, newEvent);
        
        pubs.forEach(pub => {
            pub.on("ok", () => {
                toastr.success(`Published Event on ${pub}`);
                console.log(`Published Event on ${pub}`);
            })

            pub.on("failed", reason => {
                toastr.error(reason);
                console.log(reason);
            })
        })
    }
    

    
    useEffect(()=> {
        connectRelay();
    },[]);

    if (events != null){
        
        return (
            <Box>
                <Button onClick={publishEvent}>
                    Publish Event
                </Button>
                <Box>
                    {events.map((event) => (
                        <ActionAreaCard key={event.id} event={event} relays={relays}/>
                    ))}
                </Box>

            </Box>
        )
    } else {
        return <div>Loading...</div>
    }
}

export default Feed