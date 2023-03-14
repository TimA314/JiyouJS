import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import { MoreVert } from '@mui/icons-material';
import { Button } from '@mui/material';

export default function DropDown(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <Box>
      <Button aria-describedby={id} type="button" onClick={handleClick}>
        <MoreVert />
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          <Button onClick={props.followUser}>{props.isFollowing ? "Unfollow" : "Follow"}</Button>
        </Box>
      </Popper>
    </Box>
  );
}