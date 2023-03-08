import {React, useEffect, useRef, useState } from 'react';
import Note from '../components/Note';
import { setEvents, setProfiles } from '../redux/nostr';
import { useDispatch, useSelector } from 'react-redux';
import toastr from 'toastr';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Button, Paper, SvgIcon } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { getEventHash, SimplePool } from 'nostr-tools';
import { Container } from '@mui/system';
import AvatarBot1 from '../assets/AvatarBot1'




function Feed(props) {
    const [events, setEvents] = useState([])
    const [profiles, setProfiles] = useState([])

    let relays = props.relays;
    console.log("relays: " + relays)
    const pool = useRef(new SimplePool())
    
    
    const loadEvents = async () => {
        try{

            let globalEvents = await pool.current.list(relays, [{kinds: [0,1]}]);
            console.log("globalEvents: " + globalEvents)
            
            
            let newEvents = globalEvents.filter((event) => event.kind === 1);
            if (newEvents && newEvents.length >= 1){
                console.log("events: " + newEvents);
                setEvents(newEvents)
            }
            
            let newProfiles = globalEvents.filter((event) => event.kind === 0);     
            if (newProfiles && newProfiles.length >= 1){
                console.log("profiles: " + newProfiles)
                setProfiles(newProfiles)
            }
            
        } catch (error) {
            console.log("event error: " + error)
        }

    }

    
    
    const getProfilePicture = (pubkey) => {
        if (!pubkey) return <Avatar alt="profile" src="../assets/botttsNeutral-1678157518910.svg"></Avatar>
        
        let profile =  profiles.find(prof => {
            return prof.pubkey === pubkey
        });
        
        console.log(profile)
        
        if (profile !== undefined){
            let parsedProfile = JSON.parse(profile.content);
            console.log(parsedProfile.picture)
            if (parsedProfile.picture !== undefined){
                return <Avatar alt="profile" src={parsedProfile.picture.toString()} />
            }
        }
        
        return <Avatar alt="profile"><AvatarBot1 /></Avatar>
    }
    loadEvents()
    useEffect(() => {
    }, [])
    return (
        <Container width="100%">
            <Container >
                <Box >
                </Box>
            </Container>
            { events?.map((event) => {
                return (
                    <Container key={event.sig}>
                        <Box sx={{ width: '100%', maxWidth: 500, margin: "10px auto", textAlign: "center"}}>
                            <Card sx={{ maxWidth: 1000}}>
                                <CardActionArea>
                                {getProfilePicture(event.pubkey)}
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