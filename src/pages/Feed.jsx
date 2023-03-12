import {React, useEffect, useState } from 'react';
import { SimplePool } from 'nostr-tools';
import { useNavigate } from 'react-router';
import Note from '../components/Note';


function Feed(props) {
    const [events, setEvents] = useState([])
    const privateKey = window.localStorage.getItem("localPk");
    const relays = props.relays;
    const navigate = useNavigate();

    
    useEffect(() => {
        const pool = new SimplePool();
        if (!privateKey || privateKey === "") navigate("/signin", {replace: true});

        const loadEvents = async () => {
            try{
                let timeSince = new Date();
                timeSince.setDate(timeSince.getDate()-5)
                let sub = pool.sub(relays, [{ kinds: [1], limit: 10}])
                
                sub.on('event', async event => {
                    if (event && !events.some((e) => e.sig === event.sig)){
                        event.profile = await addProfileToEvent(event.pubkey)
                        setEvents((prevEvents) => {
                            let newEvents = sortEvents([...prevEvents, event])
                            console.log(newEvents);
                            return newEvents;
                        });
                    } 
                })

            } catch (error) {
                console.error("event error: " + error)
            } finally {
                if (pool){
                    await pool.close();
                }
            }
        }

        const sortEvents = (newEvents) => {
            if (!newEvents) return newEvents;
            
            const sortedEvents = newEvents.sort((a, b) => a.created_at < b.created_at).filter((event) => event.profile[0])
            return sortedEvents;
        }

        const addProfileToEvent = async (eventPubkey) => {
            let prof = await pool.list(relays, [{kinds: [0], authors: [eventPubkey], limit: 1 }])

            if(prof){
                return prof;
            }

            return null;
        }

        loadEvents();
    }, [events, navigate, privateKey, relays])

    return (
        <>
            {events.map(e => {
                return (
                    <Note key={e.sig + Math.random()} event={e} />
                )
            })}
        </>
    )
}

export default Feed