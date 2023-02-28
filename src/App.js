import * as React from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme, } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Feed from './pages/Feed';
import LabelBottomNavigation from './components/NavBar';
import { Route, Routes } from 'react-router';
import NewEventForm from './components/NewEventForm';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import SignIn from './pages/SignIn';

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
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
            borderRadius: 1,
            p: 3,
          }}
        >
          <Box>
            <LabelBottomNavigation />
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/new-event" element={<NewEventForm />} />
              <Route path="/profile" element={<SignIn />} />
              <Route path="/follows" element={<Feed />} />
              <Route path="/signin" element={<SignIn />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
  );
}