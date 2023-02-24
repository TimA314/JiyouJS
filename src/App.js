import * as React from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme, } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Home from './pages/Home';
import LabelBottomNavigation from './components/NavBar';


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
          <Home />
        </Box>
      </Box>
    </ThemeProvider>
  );
}