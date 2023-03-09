import {React, useContext, useEffect, useRef, useState } from 'react';
import toastr from 'toastr';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { SimplePool } from 'nostr-tools';
import { Container } from '@mui/system';
import { NostrContext } from '../context/NostrContext';
import { useNavigate } from 'react-router';
import { bech32ToHex, splitByUrl } from '../util';
import { Image } from '@mui/icons-material';




function Feed() {
    const [events, setEvents] = useState([])
    const [profiles, setProfiles] = useState([])

    const privateKey = useContext(NostrContext).privateKey;
    const publicKey = useContext(NostrContext).publicKey;
    const relays = useContext(NostrContext).relays;
    const navigate = useNavigate();
    
    console.log("Private Key: " + privateKey);
    console.log("relays: " + relays) 
    
    
    // const getProfile = (pubkey) => {
        //         return pool.current.list(relays, [{authors: {pubkey}, kinds: [0]}])
        // }
        
        useEffect(() => {
            if (privateKey === "") navigate("/signin", {replace: true});
            const pool = new SimplePool();
            const loadEvents = async () => {
                try{
                    let sub = pool.sub(
                        relays,
                        [
                          {
                            kinds: [0,1]
                            // authors: [
                            //     bech32ToHex("npub1hy8j6fcmyv3cefgalg70c6hwmzda7kqzwrykc58eurvu5rfhn4lspdpcv7")
                            // ]
                          }
                        ]
                      )

                      sub.on('event', event => {
                        // this will only be called once the first time the event is received
                    
                        
                        setEvents([...events, event])
                      })
                    // let globalEvents = await pool.list(relays, [{kinds: [0,1],  authors: []}]);         
                    // let parsedEvents = JSON.parse(globalEvents);
                    // let prof = parsedEvents.find((event => event.kind === 0));
                    // console.log(prof)
                    // let newEvents = globalEvents;

                    // if (newEvents && newEvents.length >= 1){
                    //     console.log("events: " + JSON.stringify(newEvents));
                    //     setEvents(newEvents)
                    // }
                
                    
                } catch (error) {
                    console.error("event error: " + error)
                }
            }

            loadEvents();
        }, [])
    
        const Notes = (kind1Events) => {
            Object.entries(kind1Events).map(async (key, value) => {
                console.log("eventmapp" + value);
                return (
                    <Box key={value.sig}>
                        <Box sx={{ width: '100%', maxWidth: 500, margin: "10px auto", textAlign: "center"}}>
                            <Card sx={{ maxWidth: 1000}}>
                                <CardActionArea>
                                    <Avatar alt="profile" src={"https://nostr.build/i/nostr.build_885215404c2420a9d672919276ebe00247fe58db4307f6239ed71c66121683bd.png"}></Avatar>
                                    <CardContent>
                                        <Typography color="text.secondary">
                                            {value.content}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Box>
                    </Box>
                )
            })
        }

    return (
        <Box width="100%">
            {events.map((event) => {
                console.log(event)
                if(event.kind === 1) {
                    return (
                        <Box key={event.sig + Math.random()} sx={{margin: "5px", padding: "5px"}}>
                            <Card>
                                <CardContent>
                                    <CardActionArea>
                                        <Typography>
                                            {event.content}
                                        </Typography>
                                        <Image src={splitByUrl(event.content)[0]} />
                                    </CardActionArea>
                                </CardContent>
                            </Card>
                        </Box>
                    )
                }

                if (event.kind === 0) {
                    return (
                        <Box key={event.sig + Math.random()}>
                            {JSON.parse(event.content).name}
                        </Box>
                    )
                }
            })}
        </Box>
    )
}
export default Feed