// styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2ecc70', // A vibrant green 
      light: '#5cd694', 
      dark: '#219653', 
    },
    secondary: {
      main: '#f39c12', // A warm orange
      light: '#f7ca65',
      dark: '#c87f0a',
    },
    // ... add more custom colors as needed
  },
  typography: {
    fontFamily: [
      '-apple-system', 
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial', 
      'sans-serif', 
      '"Apple Color Emoji"', 
      '"Segoe UI Emoji"', 
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700, 
    },
    h2: {
      fontWeight: 600,
    },
    // ... customize other typography elements
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Use sentence case for buttons 
          borderRadius: 5, // Slightly rounded button corners 
        },
      },
    },
    // ... customize other Material UI components 
  },
});

export default theme;