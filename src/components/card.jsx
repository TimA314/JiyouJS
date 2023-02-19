import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export default function ActionAreaCard(props) {

    let content = props.event.content;
    let pubkey = props.event.pubkey;
    console.log(pubkey)

  return (
    <div>
        <Card sx={{ maxWidth: 345, backgroundColor: "lightBlue", margin: "10px auto", textAlign: "center" }}>
            <CardActionArea>
                <CardMedia
                component="img"
                height="140"
                src={content.picture}
                alt="picture"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {content}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </div>
  );
}