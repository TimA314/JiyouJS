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
import { Box, CardActionArea, Button, Paper } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import Avatar from '@mui/material/Avatar';



import { getEventHash, SimplePool } from 'nostr-tools';
import { Container } from '@mui/system';

function Feed(props) {
    const [eventList, setNewEvents] = useState([]);
    const [profileList, setProfileList] = useState([]);

    const dispatch = useDispatch();
    const relays = useSelector(state => state.nostr.relayList);
    
    const pool = new SimplePool()

    // newEvent.id = getEventHash(newEvent);
    // newEvent.sig = signEvent(newEvent, sk);
    
    const loadEvents = async () => {
        try{
            let globalEvents = await pool.list(relays, [{kinds: [0,1]}]);
            let profiles = globalEvents.filter((event) => event.kind === 0);
            let events = globalEvents.filter((event) => event.kind === 1);

            setNewEvents(events)
            setProfileList(profiles)
            dispatch(setEvents(events))
        } catch(error) {
            console.log("event error: " + error)
        }
    }
    const getProfilePicture = (pubkey) => {
        let profile =  profileList.find(prof => {
            return prof.pubkey === pubkey
            });
            console.log(profile)
            if (profile !== undefined){
                let parsedProfile = JSON.parse(profile.content);
                console.log(parsedProfile.picture)
                if (parsedProfile.picture !== undefined){
                    return parsedProfile.picture.toString();
                }
            }
        return "/static/images/avatar/1.jpg";
    }

    useEffect(() => {

    }, [])

    return (
        <Container width="100%">
            <Container >
                <Box >
                    <Button onClick={loadEvents}>
                        <CachedIcon />
                    </Button>
                </Box>
            </Container>
            {eventList.map((event) => {
                return (
                    <Container key={event.sig}>
                        <Box sx={{ width: '100%', maxWidth: 500, margin: "10px auto", textAlign: "center"}}>
                            <Card sx={{ maxWidth: 1000}}>
                                <CardActionArea>
                                <Avatar alt="Remy Sharp" src={getProfilePicture(event.pubkey)} />
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
                
        </Container>
    )

}
export default Feed