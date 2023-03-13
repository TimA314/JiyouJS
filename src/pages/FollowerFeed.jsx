import {React, useContext, useEffect, useRef, useState } from 'react';
import { getPublicKey, SimplePool } from 'nostr-tools';
import { useNavigate } from 'react-router';
import Note from '../components/Note';
import { isValidKey } from '../NostrFunctions';
import { sortEvents } from '../util';


function FollowerFeed(props) {
    const [events, setEvents] = useState([])
    const [followerPubKeyArray, setFollowerPubKeyArray] = useState([])
    const privateKey = window.localStorage.getItem("localPk");
    const relays = props.relays;
    const navigate = useNavigate();

    const pool = new SimplePool();
    
    useEffect(() => {
        if (!privateKey || privateKey === "") navigate("/signin", {replace: true});

        const loadEvents = async () => {
            try{
                let followerEvent = await pool.list(relays, [{kinds: [3], authors: [getPublicKey(privateKey)], limit: 1 }])
                console.log(followerEvent[0])
                if (!followerEvent[0] || !followerEvent[0].tags || !followerEvent[0].tags[0] || followerPubKeyArray.some((e) => e === followerEvent[0].pubkey)) return;

                for (let i = 0; i < followerEvent[0].tags.length; i++){
                    if (followerEvent[0].tags[i][0] !== "p"){
                        continue;
                    }
                    if (isValidKey(followerEvent[0].tags[i][1])){

                        setFollowerPubKeyArray((prevEvents) => {
                            return [...prevEvents, followerEvent[0].tags[i][1]];
                        })
                    }
                }

                console.log(followerPubKeyArray)
                let poolOfEvents = await pool.list(relays, [{kinds: [1], authors: [followerPubKeyArray], limit: 100 }])
                console.log("poolEvents" + JSON.stringify(poolOfEvents))

                setEvents((prevEvents) => {
                    let newEvents = sortEvents(poolOfEvents)
                    return newEvents;
                });

            } catch (error) {
                console.error("event error: " + error)
            }
        }
        
        loadEvents();
    }, [])
    

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

export default FollowerFeed