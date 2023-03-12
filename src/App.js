import * as React from 'react';
import { ThemeProvider, createTheme, } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Container } from '@mui/system';

import Feed from './pages/Feed';
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router';
import NewEventForm from './components/NewEventForm';
import SignIn from './pages/SignIn';
import Relays from './pages/Relays';
import { CssBaseline } from '@mui/material';
import Profile from './pages/Profile';

export default function App() {
  const [relays, setRelays] = React.useState([
    "wss://eden.nostr.land",
    "wss://relay.snort.social",
    "wss://relay.nostr.info",
    "wss://nostr.oxtr.dev",
    "wss://relay.nostr.bg",
    "wss://offchain.pub",
    "wss://nostr.bitcoiner.social",
    "wss://nostr.relayer.se",
    "wss://nostr.foundrydigital.com",
    "wss://no.str.cr",
  ]);
  const [profile, setProfile] = React.useState(null);



  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const theme = React.useMemo(
    () =>
    createTheme({
      palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );



  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Container
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
              color: 'text.primary',
              p: 3,
            }}>
              <Routes>
                <Route path="/" element={<Feed relays={relays}/>} />
                <Route path="/new-event" element={<NewEventForm relays={relays}/>} />
                <Route path="/profile" element={<Profile relays={relays} />} />
                <Route path="/feed" element={<Feed relays={relays} />} />
                <Route path="/relays" element={<Relays relays={relays} setRelays={setRelays} />} />
                <Route path="/signin" element={<SignIn relays={relays} />} />
              </Routes>
              <NavBar/>
          </Container>
      </ThemeProvider>
  );
}