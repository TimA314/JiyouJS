import { Box, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';

export default function Profile(props) {
// const profile = useContext(NostrContext).profile;
const privateKey = window.localStorage.getItem("localPk");
console.log("pk profile page : " + privateKey + "Session pk: " + privateKey);
const navigate = useNavigate();
// console.log(JSON.stringify(profile));

useEffect(() => {
  if (!privateKey || privateKey === "") navigate("/signin", {replace: true});
})

const handleLogout = (e) => {
  e.preventDefault();
  window.localStorage.clear();
  navigate("/signin", {replace: true});
}

  return (
    
    <Box>
      Profile
      <Box sx={{}}>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Box>

  )
}
