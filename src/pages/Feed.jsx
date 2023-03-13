import {React, useEffect, useState } from 'react';
import { getEventHash, getPublicKey, signEvent, SimplePool } from 'nostr-tools';
import { useNavigate } from 'react-router';
import Note from '../components/Note';
import { isValidKey, publishEvent } from '../NostrFunctions';
import { sortEvents } from '../util';


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
                let sub = pool.sub(relays, [{ kinds: [1], limit: 5, since: (timeSince / 1000)}])
                
                sub.on('event', async event => {
                    if (event && !events.some((e) => e.sig === event.sig)){
                        event.profile = await addProfileToEvent(event.pubkey)
                        setEvents((prevEvents) => {
                            let newEvents = sortEvents([...prevEvents, event])
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

        const addProfileToEvent = async (eventPubkey) => {
            let prof = await pool.list(relays, [{kinds: [0], authors: [eventPubkey], limit: 1 }])

            if(prof){
                return prof;
            }

            return null;
        }

        loadEvents();
    }, [])

    const followEvent = async (userToFollowPk) => {
        let pool = new SimplePool()

        let followersPkList = [["p", userToFollowPk]];

        let folowersEvent = await pool.list(relays, [{kinds: [3], authors: [getPublicKey(privateKey)], limit: 1}]);

        console.log("followersEvent: " + JSON.stringify(folowersEvent[0].tags[0][0]));

        if (folowersEvent[0] && folowersEvent[0].tags){
            for (let i = 1; i <= folowersEvent[0].tags.lenth; i++) {
                if (folowersEvent[0].tags[i][0] === "p"){
                    followersPkList.push(["p", folowersEvent[0].tags[i][1]]);
                }
            }
        }       

        let newFollowEvent = {
            kind: 3,
            pubkey: getPublicKey(privateKey),
            created_at: Math.floor(Date.now() / 1000),
            tags: followersPkList,
            content: ''
          }

        newFollowEvent.id = getEventHash(newFollowEvent);
        newFollowEvent.sig = signEvent(newFollowEvent, privateKey);

        let response = await publishEvent(newFollowEvent, pool, relays)
        if (response){
            console.log("Publish Response: " + response)
        }
        await pool.close();
    }

    return (
        <>
            {events.map(e => {
                return (
                    <Note key={e.sig + Math.random()} event={e} followEvent={followEvent}/>
                )
            })}
        </>
    )
}

export default Feed