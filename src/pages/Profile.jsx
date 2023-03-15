import { AppBar, Avatar, Box, Button, Card, IconButton, InputAdornment, MenuItem, Paper, TextField, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/system';
import { getPublicKey, SimplePool } from 'nostr-tools';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import SaveIcon from '@mui/icons-material/Save';



export default function Profile(props) {
const [profile, setProfile] = useState(null);
const [profileImageUrl, setProfileImageUrl] = useState("");
const privateKey = window.localStorage.getItem("localPk");
console.log("pk profile page : " + privateKey + "Session pk: " + privateKey);
const navigate = useNavigate();

// console.log(JSON.stringify(profile));
// ----------------------------------------------------------------------


const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5, 0),
}));

const StyledAvatar = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5, 12),
}));
// ----------------------------------------------------------------------

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
        <Box sx={{}}>
            <Button onClick={handleLogout}>Logout</Button>
        </Box>
        <Toolbar >
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuItem />
          </IconButton>
          <Typography variant="h6">
            {profile && profile.content ? profile.content.name : getPublicKey(privateKey)}
          </Typography>
          <StyledAvatar>
            <Avatar
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973461_1280.png"
              sx={{ width: 200, height: 200, zIndex: "right" }}
              />
          </StyledAvatar>
        </Toolbar>
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
