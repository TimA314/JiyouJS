import {React, useEffect, useState } from 'react';
import Note from '../components/Note';
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
        let parsedEvents = [];
        newEvents.forEach((event) => parsedEvents.push(JSON.stringify(event)))
        setEventList(parsedEvents);
        dispatch(setEvents(parsedEvents));
        console.log(`Retrieved Events: ${eventList}`);
    }
    
    useEffect(()=> {
        getEvents();
    },[]);

    if (eventList !== []){
        return (
            <Box>
                <Button href='/new-event'>
                    New Event
                </Button>
                <Box>
                    {eventList.filter((value, index, self) => self.indexOf(value) === index).map((event) => (
                        <Note key={event.id} event={event}/>
                    ))}
                </Box>
                
            </Box>
        )
    } else {
        return <div>Loading...</div>
    }
}

export default Feed