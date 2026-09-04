import { tokens } from "../tokens";

export const MuiTextField = {
  defaultProps: {
    variant: "outlined",
    size: "small",
  },

  styleOverrides: {
    root: ({ theme }) => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: tokens.radius.md,

        "& fieldset": {
          borderColor: theme.palette.divider,
        },

        "&:hover fieldset": {
          borderColor: theme.palette.text.primary,
        },

        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main,
        },
      },

      "& .MuiInputLabel-root": {
        fontSize: "0.875rem",
      },

      "& .MuiInputBase-input": {
        fontSize: "0.875rem",
      },
    }),
  },
};
