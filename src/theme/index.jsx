import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#526D82",
      light: "#6D8699",
      dark: "#27374D",
      contrastText: "#fff",
    },

    secondary: {
      main: "#9DB2BF",
      light: "#DDE6ED",
      dark: "#7B97A8",
    },

    background: {
      default: "#F7F9FB",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#27374D",
      secondary: "#526D82",
    },

    divider: "#DDE6ED",

    success: {
      main: "#2E7D32",
    },

    warning: {
      main: "#ED6C02",
    },

    error: {
      main: "#D32F2F",
    },

    info: {
      main: "#0288D1",
    },
  },

  typography: {
    fontFamily: `"Atkinson Hyperlegible", "Inter", "Roboto", sans-serif`,
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(39,55,77,0.08)",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
