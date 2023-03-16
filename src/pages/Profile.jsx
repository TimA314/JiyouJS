import { AppBar, Avatar, Box, Button, Card, IconButton, Input, InputAdornment, MenuItem, Paper, Stack, TextField, Toolbar, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/system';
import { getEventHash, getPublicKey, signEvent, SimplePool } from 'nostr-tools';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';
import SaveIcon from '@mui/icons-material/Save';



export default function Profile(props) {
const smallScreen = useMediaQuery('(max-width:600px)');
const profileRef = useState(null);
const profileImageUrlRef = useRef("");
const bannerImageUrlRef = useRef("");
const privateKey = window.localStorage.getItem("localPk");
console.log("pk profile page : " + privateKey + "Session pk: " + privateKey);
const navigate = useNavigate();
console.log(smallScreen ? "small screen" : "larger screen")


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
  maxWidth: 300,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5, 0),
}));

const SmallScreenAvatar = styled('div')(({ theme }) => ({
  maxWidth: 300,
  margin: "auto",
  display: 'flex',
  justifyContent: 'center',
  flexDirection:'column',
}));

// ----------------------------------------------------------------------

const StyledContent = smallScreen ? SmallScreenStyle : MediumToLargeScreenStyle;
const StyledToolbar = smallScreen ? SmallScreenAvatar : MediumToLargeAvatar;
let pool = new SimplePool();

useEffect(() => {
  if (!privateKey || privateKey === "") navigate("/signin", {replace: true});
  const getUserProfile = async () => {
    let prof = await pool.list(props.relays, [{kinds: [0], authors: [getPublicKey(privateKey)], limit: 1 }])
    console.log(prof);
    if (prof !== [] && prof[0].content) {
      console.log(JSON.parse(prof[0].content))
      profileRef.current = JSON.parse(prof[0].content);
      profileImageUrlRef.current = JSON.parse(prof[0].content).picture;
    }
  }
  getUserProfile();
},[])

const handleFormSubmit = (e) => {
  e.preventDefault();
  updateProfileEvent(profileImageUrlRef.current, bannerImageUrlRef.current);
}

const updateProfileEvent = async (newProfileImageUrl, newBannerImageUrlInput) => {
  console.log("updating profile")
  let newContent = {};
  

    newContent = {name: "Test", picture: newProfileImageUrl, banner: newBannerImageUrlInput};
  

  
  let newProfileEvent = {
      kind: 0,
      pubkey: getPublicKey(privateKey),
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: JSON.stringify(newContent)
    }
  console.log("New Profile Event: " + newProfileEvent)


  newProfileEvent.id = getEventHash(newProfileEvent);
  newProfileEvent.sig = signEvent(newProfileEvent, privateKey);

  const pubs = await pool.publish(props.relays, newProfileEvent);

  pubs.forEach(pub => {
      pub.on("ok", () => {
          console.log(`Published Event`);
          return "ok";
      })

      pub.on("failed", reason => {
          console.log(reason);
          return "failed";
      })
  })
}

const handleProfileImageUrlInputChange = (e) => {
  console.log(e.target.value)
  profileImageUrlRef.current = e.target.value;
}

const handleBannerImageUrlInputChange = (e) => {
  bannerImageUrlRef.current = e.target.value;
}

const handleLogout = (e) => {
  e.preventDefault();
  alert("Logged out.");
  window.localStorage.clear();
  navigate("/signin", {replace: true});
}

if(privateKey){
  return (
    <Box width="100%">
      <AppBar position="static" >
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
            src="https://api.dicebear.com/5.x/bottts/svg?seed=Cookie&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01"
            sx={{ width: 200, height: 200}}
            />
          <Typography variant="h6" alignSelf="center" margin="15px" display="flex">
            {profileRef && profileRef.content ? profileRef.content.name : "Nostrich"}
          </Typography>
        </StyledToolbar>
      </AppBar>

      <StyledContent>
        <Paper>
          <Card>
            <form>
              <Stack direction="column" spacing={5} marginBottom="10px">
              <Button variant="contained" type='submit' color='success' onClick={handleFormSubmit}>
                  SAVE
                </Button>
                <TextField 
                  id="profileImageUrlInput"
                  onChange={handleProfileImageUrlInputChange}
                  value={profileImageUrlRef.current}
                  variant="outlined" 
                  color='secondary' 
                  fullWidth
                  InputProps={{
                    endAdornment: 
                      <InputAdornment position="end">
                          <SaveIcon />
                      </InputAdornment>
                  }}
                />
                <Input
                    id="bannerImageUrlInput"
                    fullWidth
                    size="large"
                    color="secondary"
                    onChange={handleBannerImageUrlInputChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <SaveIcon />
                        </InputAdornment>
                    }
                />
              </Stack>
            </form>
          </Card>
        </Paper>
      </StyledContent>
    </Box>
  )
  } else {
    <Box></Box>
  }
}
