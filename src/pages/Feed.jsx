import {React, useEffect, useState } from 'react';
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




function Feed(props) {
    const relays = useSelector(state => state.nostr.relayList);
    const events = useSelector(state => state.nostr.events);
    const profileList = useSelector(state => state.nostr.profileList)
    const dispatch = useDispatch();
    
    console.log("relays: " + relays)
    
    const loadEvents = async () => {
        const pool = new SimplePool()
        try{

            let globalEvents = await pool.list(relays ?? ['wss://eden.nostr.land'], [{kinds: [0,1]}]);
            console.log("globalEvents: " + globalEvents)
            
            
            let events = globalEvents.filter((event) => event.kind === 1);
            if (events && events.length >= 1){
                console.log("events: " + events);
                dispatch(setEvents(events))
            }
            
            
            let profiles = globalEvents.filter((event) => event.kind === 0);     
            if (profiles && profiles.length >= 1){
                console.log("profiles: " + profiles)
                dispatch(setProfiles(profiles))
            }
            
        } catch {
            console.log("event error: ")
        }

    }
    loadEvents()
    setTimeout(() => {

    }, 5000)
    

    const getProfilePicture = (pubkey) => {
        if (!pubkey) return <Avatar alt="profile" src="../assets/botttsNeutral-1678157518910.svg"></Avatar>
        let profile =  profileList.find(prof => {
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
        return <Avatar alt="profile" src="../assets/botttsNeutral-1678157518910.svg"></Avatar>
    }

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