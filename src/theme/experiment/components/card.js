import { tokens } from "../tokens";

export const MuiCard = {
  defaultProps: {
    elevation: 0,
  },

  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: tokens.radius.lg,
      border: "1px solid",
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.background,
      backgroundImage: "none",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    }),
  },
};

export const MuiCardHeader = {
  styleOverrides: {
    root: {
      padding: "24px 24px 0",
    },

    title: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },

    subheader: {
      fontSize: "0.875rem",
      color: ({ theme }) => theme.palette.text.secondary,
    },
  },
};

export const MuiCardContent = {
  styleOverrides: {
    root: {
      padding: "24px",

      "&:last-child": {
        paddingBottom: "24px",
      },
    },
  },
};

export const MuiCardActions = {
  styleOverrides: {
    root: {
      padding: "0 24px 24px",
      gap: 8,
    },
  },
};
