import {React, useEffect, useState } from 'react';
import { getPublicKey, SimplePool } from 'nostr-tools';
import { useNavigate } from 'react-router';
import Note from '../components/Note';
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

                let followerPks = await getUserFollowers()
                let poolOfEvents = await pool.list(relays, [{kinds: [1], authors: followerPks, limit: 100 }])

                console.log("poolEvents" + JSON.stringify(poolOfEvents))

                if(!poolOfEvents) {
                    return;
                }

                for(let i=0;i<poolOfEvents.length;i++) {
                    let prof = await pool.list(relays, [{kinds: [0], authors: [poolOfEvents[i].pubkey], limit: 1 }])

                    if(prof){
                        poolOfEvents[i].profile = prof;
                    }

                    setEvents((prevEvents) => {
                        let newEvents = sortEvents([...prevEvents, poolOfEvents[i]], followerPks ?? [])
                        return newEvents;
                    });
                }

            } catch (error) {
                console.error("event error: " + error)
            }
        }

        const getUserFollowers = async() => {
            let userFollowerEvent = await pool.list(relays, [{kinds: [3], authors: [getPublicKey(privateKey)], limit: 1 }])

            if (!userFollowerEvent[0] || !userFollowerEvent[0].tags) return;

            let followerArray = userFollowerEvent[0].tags.filter((tag) => tag[0] === "p");
            let followerPks = [];
            for(let i=0; i<followerArray.length;i++){
                followerPks.push(followerArray[i][1]);
            }
            return followerPks;
        }

        loadEvents();
    }, [])

    const unFollowEvent = (unfollowPk) => {
        console.log("unfollow: " + unfollowPk)
    }
    
    if (events && events.length > 0) {
        return (
            <>
                {events.map(e => {
                    return (
                        <Note key={e.sig + Math.random()} event={e} unFollowEvent={unFollowEvent}/>
                    )
                })}
            </>
        )
    } else {
        return <></>
    }
}

export default FollowerFeed