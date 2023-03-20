import { AppBar, Avatar, Box, Button, Card, FormControl, IconButton, InputAdornment, MenuItem, Paper, Stack, TextField, Toolbar, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/system';
import { getEventHash, getPublicKey, signEvent, SimplePool, validateEvent, verifySignature } from 'nostr-tools';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageIcon from '@mui/icons-material/Image';


export default function Profile(props) {
const smallScreen = useMediaQuery('(max-width:600px)');
const [getProfileEvent, setGetProfileEvent] = useState(true);
const profileRef = useRef({});
const privateKey = window.localStorage.getItem("localPk");
const navigate = useNavigate();
console.log(smallScreen ? "small screen" : "larger screen")
const pool = new SimplePool();
const relays = props.relays;

// ----------------------------------------------------------------------

const MediumToLargeScreenStyle = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5, 0),
}));

const MediumToLargeAvatar = styled('div')(({ theme }) => ({
  display: "flex",
  margin: "auto",
  flexDirection: "column",
  justifyContent: "center"
}));

const SmallScreenStyle = styled('div')(({ theme }) => ({
  maxWidth: 400,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5, 0),
}));

const SmallScreenAvatar = styled('div')(({ theme }) => ({
  maxWidth: 400,
  margin: "auto",
  display: 'flex',
  justifyContent: 'center',
  flexDirection:'column',
}));

const styles = {
  banner: {
      height: 400,
      backgroundImage: `url(${profileRef.current.banner})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      //width: `calc(100vw + 48px)`,
      margin: -24,
      padding: 24,
  }
};

const StyledContent = smallScreen ? SmallScreenStyle : MediumToLargeScreenStyle;
const StyledToolbar = smallScreen ? SmallScreenAvatar : MediumToLargeAvatar;

// ----------------------------------------------------------------------


useEffect(() => {
  if (!privateKey || privateKey === "") navigate("/signin", {replace: true});
  if (!getProfileEvent) return;

  const getUserProfile = async () => {
    let prof = await pool.list(relays, [{kinds: [0], authors: [getPublicKey(privateKey)], limit: 1 }])

    if (prof && prof[0] && prof[0].content) {

      let parsedProf = JSON.parse(prof[0].content);
      
      if (!parsedProf || parsedProf.length < 1) return;

      profileRef.current = parsedProf;
      console.log(parsedProf)
      setGetProfileEvent(false)
    }
  }

  getUserProfile();
})


const handleFormSubmit = (e) => {
  e.preventDefault();
  let imageUrlInput = document.getElementById("profileImageUrlInput");
  let bannerUrlInput = document.getElementById("bannerImageUrlInput");
  console.log(imageUrlInput.value, bannerUrlInput.value);
  updateProfileEvent(imageUrlInput.value, bannerUrlInput.value);
}

const updateProfileEvent = async (imageUrlInput, bannerUrlInput) => {
  let prof = await pool.list(relays, [{kinds: [0], authors: [getPublicKey(privateKey)], limit: 1 }])

  const newContent = JSON.stringify({name: "JiYou", about: "", picture: imageUrlInput.toString(), banner: bannerUrlInput});

  let newProfileEvent = {
      kind: 0,
      pubkey: getPublicKey(privateKey),
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: newContent
    }
  console.log("New Profile Event: " + JSON.stringify(newProfileEvent))


  newProfileEvent.id = getEventHash(newProfileEvent);
  newProfileEvent.sig = signEvent(newProfileEvent, privateKey);

  if(!validateEvent(newProfileEvent) || !verifySignature(newProfileEvent)){
    console.log("Event is Invalid")
    return;
  }
  console.log("Event is valid")

  let pubs = pool.publish(relays, newProfileEvent);
  console.log("pubs: " + JSON.stringify(pubs));
  
  pubs.on("ok", () => {
    console.log(`Published Event`);
    setGetProfileEvent(true);
    return "ok";
  })

  pubs.on("failed", reason => {
      console.log("failed: " + reason);
      return "failed";
  })
}

const handleLogout = (e) => {
  alert("Logged out.");
  window.localStorage.clear();
  navigate("/signin", {replace: true});
}

if(privateKey){
  return (
    <Box width="100%">
      <Paper ref={profileRef} style={styles.banner}>
        <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none'}} >
          <Box>
              <Button type="button" onClick={handleLogout}>Logout</Button>
          </Box>
          <Toolbar >
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuItem />
            </IconButton>
          </Toolbar>
          <StyledToolbar>
              <Avatar
                src={profileRef.current.picture ? profileRef.current.picture : "https://api.dicebear.com/5.x/bottts/svg?seed=Cookie&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01"}
                sx={{ width: 200, height: 200}}
                />
            <Typography variant="h6" alignSelf="center" margin="15px" display="flex" >
              {profileRef.current.name}
            </Typography>
          </StyledToolbar>
        </AppBar>
      </Paper>

      <StyledContent>
              <Stack direction="column" spacing={5} marginBottom="10px">
              <Button variant="contained" type='submit' color='success' onClick={handleFormSubmit}>
                  SAVE
                </Button>
                <TextField 
                  id="profileImageUrlInput"
                  label="Profile Image URL"
                  color='secondary'
                  defaultValue={profileRef.current.picture} 
                  fullWidth
                  InputProps={{
                    startAdornment: 
                      <InputAdornment position="start">
                          <ImageIcon />
                      </InputAdornment>
                  }}
                  />
                <TextField
                    id="bannerImageUrlInput"
                    label="Banner Image URL"
                    fullWidth
                    color="secondary"
                    defaultValue={profileRef.current.banner} 
                    InputProps={{
                      startAdornment: 
                      <InputAdornment position="start">
                            <ImageIcon />
                        </InputAdornment>
                    }}
                    />
              </Stack>
      </StyledContent>
    </Box>
  )
  } else {
    <Box></Box>
  }
}
