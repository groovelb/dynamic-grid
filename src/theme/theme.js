import { createTheme } from '@mui/material/styles';

/**
 * 미니멀 디자인 테마
 * - 흰색 배경, 검정색 UI
 * - Border 없음
 * - 최소한의 스타일
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: 'none',
        },
      },
    },
  },
});

export default theme;
