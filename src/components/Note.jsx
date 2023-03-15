import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { purple } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment/moment';
import { GetImageFromPost } from '../NostrFunctions';
import DropDown from './DropDown';
import { DiceBears } from '../util';
import { getPublicKey } from 'nostr-tools';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Note(props) {
  const [expanded, setExpanded] = React.useState(false);
  const event = props.event;
  const imageFromPost = GetImageFromPost(event.content);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //Set Profile Content and Profile Picture
  let profileContent = null;
  let profilePicture = DiceBears();
  if (event && event.profile[0] && event.profile[0].content){
    profileContent = JSON.parse(event.profile[0].content);
    if (profileContent.picture) profilePicture = profileContent.picture;
  } 

  const followUserClicked = async () => {
    console.log("unfollwing user: " + event.pubkey)

    await props.followEvent(event.pubkey);
  }

  const unFollowUserClicked = async () => {
    console.log("unfollowEvent: " + event.pubkey);
  }
  
  return (
    <Card sx={{ maxWidth: "100%", margin: "10px", alignItems: "flex-start"}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: purple[500] }} aria-label="recipe" src={profilePicture}>
          </Avatar>
        }
        action={
            <DropDown  followUser={followUserClicked} unFollowUser={unFollowUserClicked} isFollowing={event.isFollowing} />
        }
        title={profileContent ? profileContent.display_name : "Unknown"}
        subheader={profileContent?.nip05 ? profileContent.nip05 : ""}
      />
      {imageFromPost && (
        <CardMedia
          component="img"
          image={imageFromPost}
          alt="picture"
        />)
      }
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        {event.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <Typography variant="subtitle2">
        {moment.unix(event.created_at).fromNow()}
        </Typography>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{}}>
          <Typography paragraph display="h6">MetaData:</Typography>
          <Typography variant="caption" display="block">
            Event Id: {event.id}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            PubKey hex: {event.pubkey}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Created: {moment.unix(event.created_at).format("LLLL")}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            UnixTime: {event.created_at}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Sig: {event.sig}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}