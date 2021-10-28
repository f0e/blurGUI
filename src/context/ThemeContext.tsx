import React, { createContext, FunctionComponent } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext({});

export const ThemeStore: FunctionComponent = ({ children }) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#242423',
      },
      secondary: {
        main: '#E8EDDF',
      },
    },
    typography: {
      fontFamily: 'Zen Kaku Gothic Antique',
      button: {
        textTransform: 'none',
      },
    },
  });

  return (
    <ThemeContext.Provider value="">
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
