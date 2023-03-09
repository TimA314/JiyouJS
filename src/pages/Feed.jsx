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
import Note from '../components/Note';




function Feed() {
    const [events, setEvents] = useState([])
    const privateKey = useContext(NostrContext).privateKey;
    const publicKey = useContext(NostrContext).publicKey;
    const relays = useContext(NostrContext).relays;
    const navigate = useNavigate();
    
    console.log("Private Key: " + privateKey);
    console.log("relays: " + relays) 
    
        useEffect(() => {
            if (privateKey === "") navigate("/signin", {replace: true});
            const pool = new SimplePool();
            const loadEvents = async () => {
                try{
                    let sub = pool.sub(
                        relays,
                        [
                          {
                            kinds: [1]
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
                    
                } catch (error) {
                    console.error("event error: " + error)
                }
            }

            loadEvents();
        }, [])

    return (
        <Box width="100%">
            {events.map((event) => {
                return (
                    <Note event={event} />
                )
            })}
        </Box>
    )
}
export default Feed