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




function Feed() {
    const [events, setEvents] = useState([])
    const [profiles, setProfiles] = useState([])

    const pk = useContext(NostrContext).privateKey;
    const relays = useContext(NostrContext).relays;
    const navigate = useNavigate();
    const pool = useRef(new SimplePool())
    
    console.log("Private Key: " + pk);
    console.log("relays: " + relays) 
    
    
    // const getProfile = (pubkey) => {
        //         return pool.current.list(relays, [{authors: {pubkey}, kinds: [0]}])
        // }
        
    useEffect(() => {
        if (pk === "") navigate("/signin", {replace: true});
        const loadEvents = async () => {
            try{
    
                let globalEvents = await pool.current.list(relays, [{kinds: [1]}]);         
                
                
                let newEvents = globalEvents.filter((event) => event.kind === 1);

                if (newEvents && newEvents.length >= 1){
                    console.log("events: " + newEvents);
                    setEvents(newEvents)
                }
            
                
            } catch (error) {
                console.log("event error: " + error)
            }
        }

        loadEvents()
    }, [])
    

    return (
        <Container width="100%">
            <Container >
                <Box >
                </Box>
            </Container>
            { events.map(async (event) => {
                return (
                    <Box key={event.sig}>
                        <Box sx={{ width: '100%', maxWidth: 500, margin: "10px auto", textAlign: "center"}}>
                            <Card sx={{ maxWidth: 1000}}>
                                <CardActionArea>
                                    <Avatar alt="profile" src={"https://nostr.build/i/nostr.build_885215404c2420a9d672919276ebe00247fe58db4307f6239ed71c66121683bd.png"}></Avatar>
                                    <CardContent>
                                        <Typography color="text.secondary">
                                            {event.content}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Box>
                    </Box>
                )
            })}
                
        </Container>
    )
}
export default Feed