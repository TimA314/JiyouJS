import {React, useContext, useEffect, useRef, useState } from 'react';
import { Box, Stack} from '@mui/material';
import { SimplePool } from 'nostr-tools';
import { NostrContext } from '../context/NostrContext';
import { useNavigate } from 'react-router';
import Note from '../components/Note';
import InfiniteScroll from 'react-infinite-scroller';


function Feed() {
    const [events, setEvents] = useState([])
    const privateKey = useContext(NostrContext).privateKey;
    const publicKey = useContext(NostrContext).publicKey;
    const relays = useContext(NostrContext).relays;
    const navigate = useNavigate();

    useEffect(() => {
        if (!privateKey || privateKey === "") navigate("/signin", {replace: true});
        const pool = new SimplePool();

        const loadEvents = async () => {
            try{
                let sub = pool.sub(relays, [{ kinds: [1] }])

                sub.on('event', event => {
                if (event !== undefined){
                    setEvents([...events, event]);
                } 
                })
            } catch (error) {
                console.error("event error: " + error)
            }
        }

        loadEvents();
    }, [events, navigate, privateKey, relays])

    return (
        <Box width="100%">
            <InfiniteScroll loadMore={false}>
                <Stack spacing={2} >
                    {events.map((event) => {
                        return (
                                <Note event={event} />
                                )
                            })}
                </Stack>
            </InfiniteScroll>
        </Box>
    )
}
export default Feed