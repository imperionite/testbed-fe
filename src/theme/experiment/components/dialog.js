import { tokens } from "../tokens";

export const MuiDialog = {
  styleOverrides: {
    paper: ({ theme }) => ({
      borderRadius: tokens.radius.lg,
      border: "1px solid",
      borderColor: theme.palette.divider,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      backgroundImage: "none",
    }),
  },
};
