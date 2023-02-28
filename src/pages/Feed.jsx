import {React, useEffect, useState } from 'react';
import ActionAreaCard from '../components/card';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import toastr from 'toastr';


import { Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';

function Feed(props) {
    const relays = useSelector(state => state.relays.relayList);
    const [events, setEvents ] = useState([]);

    console.log(`Relays: ${relays}`);
    // newEvent.id = getEventHash(newEvent);
    // newEvent.sig = signEvent(newEvent, sk);


    
    useEffect(()=> {

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