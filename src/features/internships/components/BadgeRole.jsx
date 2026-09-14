import { Chip } from "@mui/material";

function BadgeRole({ value }) {
  return (
    <Chip
      label={value}
      size="small"
      color="default"
      variant="outlined"
      sx={{
        color: "text.primary",
        borderColor: "divider",
      }}
    />
  );
}

export default BadgeRole;
