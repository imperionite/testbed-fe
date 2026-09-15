import { Chip } from "@mui/material";

function BadgeStatus({ value }) {
  return (
    <Chip
      label={value}
      size="small"
      color={value === "Submitted" ? "success" : "theme.palette.warning.main"}
      variant="filled"
    />
  );
}

export default BadgeStatus;