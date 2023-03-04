import * as React from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme, } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Container } from '@mui/system';

import Feed from './pages/Feed';
import LabelBottomNavigation from './components/NavBar';
import { Route, Routes } from 'react-router';
import NewEventForm from './components/NewEventForm';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import SignIn from './pages/SignIn';
import Relays from './pages/Relays';

export default function App() {
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
        <Container
          sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
            p: 3,
          }}>
            <LabelBottomNavigation />
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/new-event" element={<NewEventForm />} />
              <Route path="/profile" element={<SignIn />} />
              <Route path="/follows" element={<Feed />} />
              <Route path="/relays" element={<Relays />} />
              <Route path="/signin" element={<SignIn />} />
            </Routes>
        </Container>
      </ThemeProvider>
  );
}