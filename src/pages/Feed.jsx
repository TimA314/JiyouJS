import {React, useEffect, useState } from 'react';
import Note from '../components/Note';
import { setEvents } from '../redux/nostr';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import toastr from 'toastr';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Button } from '@mui/material';



import { getEventHash, SimplePool } from 'nostr-tools';
import { Container } from '@mui/system';

function Feed(props) {
    const [eventList, setNewEvents] = useState([]);
    const dispatch = useDispatch();
    const relays = useSelector(state => state.nostr.relayList);
    
    const pool = new SimplePool()

    // newEvent.id = getEventHash(newEvent);
    // newEvent.sig = signEvent(newEvent, sk);
    
    const loadEvents = async () => {
        try{
            let globalEvents = await pool.list(relays, [{kinds: [1]}]);
            setNewEvents(globalEvents)
        } catch(error) {
            console.log("event error: " + error)
        }
    }

    useEffect(() => {

    }, [])

    return (
        <Container>
            <Box>
                <Button onClick={loadEvents}>
                    Load Events
                </Button>
                {eventList.map((event) => {
                    return (
                        <Container key={event.sig}>
                            <Box sx={{ width: '100%', maxWidth: 500, margin: "10px auto", textAlign: "center"}}>
                                <Card sx={{ maxWidth: 345}}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography color="text.secondary">
                                                {event.content}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Box>
                        </Container>
                    )
                })}
                
            </Box>
        </Container>
    )

}
export default Feed