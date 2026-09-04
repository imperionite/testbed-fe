import { Chip } from "@mui/material";

function BadgeStatus({ value }) {
  return (
    <Chip
      label={value}
      size="small"
      color={value === "Active" ? "success" : "error"}
      variant="filled"
    />
  );
}

export default BadgeStatus;