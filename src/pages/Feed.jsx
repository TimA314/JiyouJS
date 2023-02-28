import {React, useEffect, useState } from 'react';
import ActionAreaCard from '../components/card';
import { setEvents } from '../redux/nostr';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import toastr from 'toastr';


import { Box, Button } from '@mui/material';
import { SimplePool } from 'nostr-tools';

function Feed(props) {
    const [eventList, setEventList] = useState([]);
    const dispatch = useDispatch();
    const relays = useSelector(state => state.nostr.relayList);
    const pool = new SimplePool()

    // newEvent.id = getEventHash(newEvent);
    // newEvent.sig = signEvent(newEvent, sk);

    const getEvents = async () => {
        let newEvents = await pool.list(relays, [{kinds: [1]}]);
        setEventList(newEvents);
        dispatch(setEvents(newEvents))
        console.log(`Retrieved Events: ${newEvents}`);
    }

    
    useEffect(()=> {
        console.log(`Retrieving Events`);
        if (eventList === []){
            getEvents();
        }
    },[]);

    if (eventList !== []){
        return (
            <Box>
                <Button href='/new-event'>
                    New Event
                </Button>
                <Box>
                    {eventList.map((event) => (
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