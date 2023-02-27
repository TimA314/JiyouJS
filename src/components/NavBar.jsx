import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import CellTowerIcon from '@mui/icons-material/CellTower';
import PublicIcon from '@mui/icons-material/Public';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';


export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, []);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Feed" href='/' icon={<PublicIcon />} />
          <BottomNavigationAction label="Follows" href='/follows' icon={<Diversity1Icon />} />
          <BottomNavigationAction label="Relays" href='/relays' icon={<CellTowerIcon />} />
          <BottomNavigationAction label="Profile" href='/profile' icon={<AccountCircleIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}