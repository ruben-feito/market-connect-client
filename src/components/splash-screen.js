import { Box } from '@mui/material';
import { Logo } from './logo';

export const SplashScreen = () => (
  <Box
    sx={{
      alignItems: 'center',
      backgroundColor: 'orange',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      justifyContent: 'center',
      left: 0,
      p: 3,
      position: 'fixed',
      top: 0,
      width: '100vw',
      zIndex: 1400,
    }}
  >
    <Box
      sx={{
        display: 'inline-flex',
        height: 90,
        width: 300,
      }}
    >
      <Logo fillColor1="#FFFFFF" fillColor2="#FFFFFF" />
    </Box>
  </Box>
);
