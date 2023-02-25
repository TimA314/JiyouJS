import * as React from 'react';
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


export default async function ActionAreaCard(props) {
    let content = props.event.content;
    let pubkey = props.event.pubkey;
    let profile = await nip05.queryProfile(pubkey)

  return (
    <div>
        <Box sx={{ width: '100%', maxWidth: 500, margin: "10px auto", textAlign: "center"}}>
            <Card sx={{ maxWidth: 345}}>
                <CardActionArea>
                    <CardMedia
                    component="img"
                    height="140"
                    src={content.picture}
                    alt="picture"
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {profile.}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {content}
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    </div>
  );
}