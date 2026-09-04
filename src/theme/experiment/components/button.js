import { tokens } from "../tokens";

export const MuiButton = {
  defaultProps: {
    disableElevation: true,
  },

  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: tokens.radius.md,
      textTransform: "none",
      fontWeight: 500,
      boxShadow: "none",

      "&:hover": {
        backgroundColor: theme.palette.primary.hover,
      },

      "&:focus-visible": {
        outline: "none",
        boxShadow: `0 0 0 2px ${theme.palette.popover.main}, 0 0 0 4px ${theme.palette.ring}`,
      },
    }),
  },

  sizeSmall: {
    minHeight: 32,
    padding: "0 12px",
  },

  sizeMedium: {
    minHeight: 36,
    padding: "0 16px",
  },

  sizeLarge: {
    minHeight: 40,
    padding: "0 20px",
  },
};
