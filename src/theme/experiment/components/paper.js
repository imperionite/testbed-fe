import { tokens } from "../tokens";

export const MuiPaper = {
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
