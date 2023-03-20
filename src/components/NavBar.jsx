import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import CellTowerIcon from '@mui/icons-material/CellTower';
import PublicIcon from '@mui/icons-material/Public';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';


export default function NavBar(props) {
  const privateKey = window.localStorage.getItem("localPk");
  const ref = React.useRef(null);
  
  React.useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, []);

  if (!privateKey) {
    return (<Box ref={ref}></Box>);
  }
  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation showLabels >
          <BottomNavigationAction label="Feed" href='/feed' icon={<PublicIcon />} />
          <BottomNavigationAction label="Follows" href='/follows' icon={<Diversity1Icon />} />
          <BottomNavigationAction label="Relays" href='/relays' icon={<CellTowerIcon />} />
          <BottomNavigationAction label="Profile" href='/profile' icon={<AccountCircleIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}