import { Box, Button, TextField, Typography } from '@mui/material'
import { SimplePool } from 'nostr-tools';
import React, { useState } from 'react'
import toastr from 'toastr';

function NewEventForm(props) {
    const [newEvent, setNewEvent] = useState(null)
    const [note, setNote] = useState("");
    const [relays, setRelay] = useState(['wss://nos.lol']);
    // var newEvent = {
    //     kind: 1,
    //     pubkey: pk,
    //     created_at: Math.floor(Date.now() / 1000),
    //     tags: [],
    //     content: "Bitcoin"
    // }
    const publishEvent = (newEvent) => {
        console.log("Event: " + newEvent)
        const pool = new SimplePool();
        const pubs = pool.publish(relays, newEvent);
        
        pubs.forEach(pub => {
            pub.on("ok", () => {
                toastr.success(`Published Event on ${pub}`);
                console.log(`Published Event on ${pub}`);
            })

            pub.on("failed", reason => {
                toastr.error(reason);
                console.log(reason);
            })
        })
    }


  return (
    <Box>
        <Typography>Publish New Event</Typography>
        <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 3, width: '60ch' },
      }}
      noValidate
      autoComplete="off"
    >
    
            <TextField
                id="filled-multiline-static"
                label="What do you want to say?"
                multiline
                fullWidth 
                rows={10}
                variant="filled"
                value={note}
                onChange={(event) => {
                    setNote(event.target.value);
                  }}
            />
      </Box>
      <Box sx={{ textAlign: "right"}}>
        <Button>Publish</Button>
      </Box>
    </Box>
  )
}

export default NewEventForm



