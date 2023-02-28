import * as React from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme, } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Feed from './pages/Feed';
import LabelBottomNavigation from './components/NavBar';
import { Route, Routes } from 'react-router';
import NewEventForm from './components/NewEventForm';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';

export default function App() {
  const [relayList, setRelayList] = React.useState(['wss://nos.lol']);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [sk, setSk] = React.useState(generatePrivateKey());
  const [pk, setPk] = React.useState(getPublicKey(sk));
  const Keys = React.createContext(pk);

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
        <Keys.Provider value={pk}>
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
              <Route path="/profile" element={<Feed />} />
              <Route path="/follows" element={<Feed />} />
            </Routes>
          </Box>
        </Box>
        </Keys.Provider>
      </ThemeProvider>
  );
}