import {React, useEffect, useState } from 'react';
import ActionAreaCard from '../components/card';
import { getEvents } from '../redux/nostr';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import toastr from 'toastr';


import { Box, Button } from '@mui/material';

function Feed(props) {
    const dispatch = useDispatch();
    const relays = useSelector(state => state.nostr.relayList);
    const events = useSelector(state => state.nostr.events);

    console.log(`Relays: ${relays}`);
    console.log(`Events: ${events}`);
    // newEvent.id = getEventHash(newEvent);
    // newEvent.sig = signEvent(newEvent, sk);


    
    useEffect(()=> {
        dispatch(getEvents())
    },[]);

    if (events != null){
        
        return (
            <Box>
                <Button href='/new-event'>
                    New Event
                </Button>
                <Box>
                    {events.map((event) => (
                        <ActionAreaCard key={event.id} event={event}/>
                    ))}
                </Box>
                
            </Box>
        )
    } else {
        return <div>Loading...</div>
    }
}

export default Feed