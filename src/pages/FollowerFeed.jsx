import {React, useContext, useEffect, useRef, useState } from 'react';
import { getPublicKey, SimplePool } from 'nostr-tools';
import { useNavigate } from 'react-router';
import Note from '../components/Note';
import { isValidKey } from '../NostrFunctions';
import { sortEvents } from '../util';


function FollowerFeed(props) {
    const [events, setEvents] = useState([])
    const privateKey = window.localStorage.getItem("localPk");
    const relays = props.relays;
    const navigate = useNavigate();

    const pool = new SimplePool();
    
    useEffect(() => {
        if (!privateKey || privateKey === "") navigate("/signin", {replace: true});

        const loadEvents = async () => {
            try{
                let followerEvents = await pool.list(relays, [{kinds: [3], authors: [getPublicKey(privateKey)], limit: 1 }])
                console.log(followerEvents[0])

                if (!followerEvents[0] || !followerEvents[0].tags) return;

                let followerArray = followerEvents[0].tags.filter((tag) => tag[0] === "p");


                console.log(followerArray)
                let poolOfEvents = await pool.list(relays, [{kinds: [1], authors: followerArray, limit: 100 }])
                console.log("poolEvents" + JSON.stringify(poolOfEvents))
                if(!poolOfEvents) {
                    console.log("bad")
                    return;
                }

                let profileAddedEvents = [];

                for(let i=0;i<poolOfEvents.length;i++) {
                    profileAddedEvents.push(addProfileToEvent(poolOfEvents[i]));
                }

                console.log("profileAddedEvents" + profileAddedEvents)
                
                setEvents((prevEvents) => {
                    let newEvents = sortEvents(profileAddedEvents)
                    return newEvents;
                });

            } catch (error) {
                console.error("event error: " + error)
            }
        }
        
        const addProfileToEvent = async (addToProfileEvent) => {
            let prof = await pool.list(relays, [{kinds: [0], authors: [addToProfileEvent.pubkey], limit: 1 }])

            if(prof){
                addToProfileEvent.profile = prof;
            }
        }

        loadEvents();
    }, [])
    
    if (events && events.length > 0) {
        return (
            <>
                {events.map(e => {
                    return (
                        <Note key={e.sig + Math.random()} event={e} followEvent={null}/>
                    )
                })}
            </>
        )
    } else {
        return <></>
    }
}

export default FollowerFeed