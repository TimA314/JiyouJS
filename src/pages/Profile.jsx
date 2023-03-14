import { AppBar, Avatar, Box, Button, IconButton, MenuItem, Toolbar, Typography } from '@mui/material'
import { getPublicKey, SimplePool } from 'nostr-tools';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';



export default function Profile(props) {
const [profile, setProfile] = useState(null);
const privateKey = window.localStorage.getItem("localPk");
console.log("pk profile page : " + privateKey + "Session pk: " + privateKey);
const navigate = useNavigate();

// console.log(JSON.stringify(profile));

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
    <Box>
          <AppBar position="static" >
          <Toolbar >
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuItem />
            </IconButton>
            <Typography variant="h6">
              {profile && profile.content ? profile.content.name : getPublicKey(privateKey)}
            </Typography>
            <Avatar
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973461_1280.png"
              sx={{ width: 100, height: 100 }}
              />
          </Toolbar>
        </AppBar>
      <Box sx={{}}>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Box>
  )
  } else {
    <Box></Box>
  }
}
