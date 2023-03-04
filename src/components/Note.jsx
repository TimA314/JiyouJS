import * as React from 'react';
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea } from '@mui/material';
import {nip05} from 'nostr-tools'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useSelector } from 'react-redux';


export default async function Note() {
    const globalEvents = useSelector(state => state.nostr.events);

    useEffect(() => {
      
    
      return () => {
        
      }
    }, [globalEvents])
    

    // let pubkey = props.event.pubkey;
    // let profile = await nip05.queryProfile(pubkey)

        return (
            <div>hi</div>
            // globalEvents.map((event) => {
            //     return (
                    

            //     )
            
        )

}