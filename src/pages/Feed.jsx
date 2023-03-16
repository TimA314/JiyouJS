import {React, useEffect, useState } from 'react';
import { getEventHash, getPublicKey, signEvent, SimplePool } from 'nostr-tools';
import { useNavigate } from 'react-router';
import Note from '../components/Note';
import { sortEvents } from '../util';


function Feed(props) {
    const [events, setEvents] = useState([])
    const privateKey = window.localStorage.getItem("localPk");
    const relays = props.relays;
    const navigate = useNavigate();
    const pool = new SimplePool();

    
    useEffect(() => {
        if (!privateKey || privateKey === "") navigate("/signin", {replace: true});

        const loadEvents = async () => {
            try{
                let followerPks = getUserFollowers()
                let timeSince = new Date();
                timeSince.setDate(timeSince.getDate()-5)
                
                let poolOfEvents = await pool.list(relays, [{kinds: [1] }])
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


                // sub.on('event', async event => {
                //     if (event && !events.some((e) => e.sig === event.sig)){
                //         event.profile = await addProfileToEvent(event.pubkey)
                //         setEvents((prevEvents) => {
                //             let newEvents = sortEvents([...prevEvents, event], followerPks)
                //             return newEvents;
                //         });
                //     } 
                // })

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

    const followEvent = async (userToFollowPk) => {


        let folowersEvent = await pool.list(relays, [{kinds: [3], authors: [getPublicKey(privateKey)], limit: 1}]);

        if (!folowersEvent[0] || !folowersEvent[0].tags) return;

        let currentFollowTags = folowersEvent[0].tags.filter((tag) => tag[0] === "p");
        console.log("currentFollowTags: " + currentFollowTags)

        currentFollowTags.push(["p", userToFollowPk]);
      
        let newFollowEvent = {
            kind: 3,
            pubkey: getPublicKey(privateKey),
            created_at: Math.floor(Date.now() / 1000),
            tags: currentFollowTags,
            content: ''
          }

        newFollowEvent.id = getEventHash(newFollowEvent);
        newFollowEvent.sig = signEvent(newFollowEvent, privateKey);

        const pubs = await pool.publish(relays, newFollowEvent);
    
        pubs.forEach(pub => {
            pub.on("ok", () => {
                console.log(`Published Event`);
                return "ok";
            })
    
            pub.on("failed", reason => {
                console.log(reason);
                return "failed";
            })
        })
    }

    return (
        <>
            {events.map(e => {
                return (
                    <Note key={e.sig + Math.random()} event={e} followEvent={followEvent} />
                )
            })}
        </>
    )
}

export default Feed