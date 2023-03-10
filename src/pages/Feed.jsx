import {React, useContext, useEffect, useRef, useState } from 'react';
import { Box, Stack} from '@mui/material';
import { SimplePool } from 'nostr-tools';
import { NostrContext } from '../context/NostrContext';
import { useNavigate } from 'react-router';
import Note from '../components/Note';


function Feed() {
    const [events, setEvents] = useState(new Set())
    const privateKey = useContext(NostrContext).privateKey;
    const publicKey = useContext(NostrContext).publicKey;
    const relays = useContext(NostrContext).relays;
    const navigate = useNavigate();

    
    useEffect(() => {
        const pool = new SimplePool();
        if (!privateKey || privateKey === "") navigate("/signin", {replace: true});

        const loadEvents = async () => {
            try{
                let sub = pool.sub(relays, [{ kinds: [1] }])

                sub.on('event', event => {
                    if (event && !events.has(event)){
                        setEvents((prevEvents) => {
                            console.log("setting Event")
                            prevEvents.add(event);
                            return prevEvents;
                        });
                    } 
                })

                return () => {
                    pool.close();
                }
            } catch (error) {
                console.error("event error: " + error)
            }
        }

        loadEvents();
    }, [events, navigate, privateKey, relays])

    return (
        <>
            {Array.from(events).map(e => {
                        return (
                            <Note key={e.sig} event={e} />
                        )
                    })}
        </>
    )
}
export default Feed