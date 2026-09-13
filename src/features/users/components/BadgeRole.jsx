import { Badge } from "./shared/Badge.jsx";

function BadgeRole({ value }) {
  return (
    <Badge
      value={value}
      variant="outlined"
      size="small"
      sx={{
        color: "text.primary",
        borderColor: "divider",
      }}
    />
  );
}

export default BadgeRole;
