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
              <NavBar position="static"/>
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/new-event" element={<NewEventForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/feed" element={<Feed  />} />
                <Route path="/relays" element={<Relays />} />
                <Route path="/signin" element={<SignIn />} />
              </Routes>
          </Container>
      </ThemeProvider>
  );
}