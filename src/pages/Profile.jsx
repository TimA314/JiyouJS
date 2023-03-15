import { AppBar, Avatar, Box, Button, Card, IconButton, InputAdornment, MenuItem, Paper, TextField, Toolbar, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/system';
import { getPublicKey, SimplePool } from 'nostr-tools';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';
import SaveIcon from '@mui/icons-material/Save';



export default function Profile(props) {
const theme = useTheme();
const smallScreen = useMediaQuery('(max-width:600px)');
const [profile, setProfile] = useState(null);
const [profileImageUrl, setProfileImageUrl] = useState("");
const privateKey = window.localStorage.getItem("localPk");
console.log("pk profile page : " + privateKey + "Session pk: " + privateKey);
const navigate = useNavigate();
console.log(smallScreen)

// console.log(JSON.stringify(profile));
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

useEffect(() => {
  if (!privateKey || privateKey === "") navigate("/signin", {replace: true});
  let pool = new SimplePool();
  const getUserProfile = async () => {
    let prof = await pool.list(props.relays, [{kinds: [0], authors: [getPublicKey(privateKey)], limit: 1 }])
    console.log(prof);
    if (prof) {
      setProfile(prof);
    }
  }
  getUserProfile();
},[])

const handleLogout = (e) => {
  e.preventDefault();
  window.localStorage.clear();
  navigate("/signin", {replace: true});
}

if(privateKey){
  return (
    <Box width="100%">
      <AppBar position="static" >
        <Box>
            <Button onClick={handleLogout}>Logout</Button>
        </Box>
        <Toolbar >
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuItem />
          </IconButton>
        </Toolbar>
        <StyledToolbar>
          <Avatar
            src="https://api.dicebear.com/5.x/bottts/svg?seed=Rascal"
            sx={{ width: 200, height: 200}}
            />
          <Typography variant="h6" alignSelf="center" margin="15px" display="flex">
            {profile && profile.content ? profile.content.name : "Display Name"}
          </Typography>
        </StyledToolbar>
      </AppBar>

      <StyledContent>
        <Paper>
          <Card>
              <TextField 
                onChange={(e) => setProfileImageUrl(e.target.value)}
                variant="outlined" 
                label="Profile Image URL" 
                color='secondary' 
                fullWidth
                InputProps={{
                  endAdornment: 
                    <InputAdornment position="end">
                      <Button>
                        <SaveIcon />
                      </Button>
                    </InputAdornment>,
                }}
                />
          </Card>
        </Paper>
      </StyledContent>
    </Box>
  )
  } else {
    <Box></Box>
  }
}
