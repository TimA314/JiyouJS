import { Box, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';

export default function Profile(props) {
// const profile = useContext(NostrContext).profile;
const sessionPk = window.localStorage.getItem("pk");
const privateKey = props.privateKey;
console.log("pk profile page : " + privateKey + "Session pk: " + sessionPk);
const navigate = useNavigate();
// console.log(JSON.stringify(profile));

useEffect(() => {
  if (!privateKey || privateKey === "") navigate("/signin", {replace: true});
})

const handleLogout = () => {
  navigate("/signin", {replace: true});
}

  return (
    
    <Box>
      Profile
      <Box sx={{}}>
        <Button >Logout</Button>
      </Box>
    </Box>

  )
}
