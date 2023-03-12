import {React, useContext, useEffect, useState } from 'react';
import { getPublicKey, SimplePool } from 'nostr-tools';
import { useNavigate } from 'react-router';
import Note from '../components/Note';
import { isValidKey } from '../NostrFunctions';


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

                let followerEvent = await pool.list(relays, [{kinds: [3], authors: [getPublicKey(privateKey)], limit: 1 }])
                if (!followerEvent || !followerEvent.tags) return;

                let followerArray = [];
                for (let i = 0; i < followerEvent.tags.length; i++){
                    if (followerEvent.tags[i] !== "p"){
                        continue;
                    }
                    if (isValidKey(followerEvent.tags[i])){
                        followerArray.push(followerEvent.tags[i]);
                    }
                }

                if (followerArray.length === 0) return;

                let sub = pool.sub(relays, [{ kinds: [1], limit: 100, authors: followerArray }])
                
                sub.on('event', async event => {
                    if (event && !events.some((e) => e.sig === event.sig)){
                        event.profile = await getProfile(event.pubkey)
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
            
            const sortedEvents = newEvents.sort((a, b) => a.created_at > b.created_at).filter((event) => event.profile[0])
            return sortedEvents;
        }

        const getProfile = async (pubkeyForProfile) => {
            let prof = await pool.list(relays, [{kinds: [0], authors: [pubkeyForProfile], limit: 1 }])

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