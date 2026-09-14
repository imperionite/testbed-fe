import { IconButton, Menu, MenuItem, Divider, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useState } from "react";
import { useThemeContext } from "../providers/ThemeContext";

export function HeaderDropdownMenu({ onLogout, isLoading }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode, toggleTheme } = useThemeContext();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        disabled={isLoading}
        aria-label="Open account menu"
      >
        <KeyboardArrowDownIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              marginTop: "14px",
              minWidth: "160px",
            },
          },
        }}
      >
        <Typography variant="overline" sx={{ px: 2, display: "block", color: "text.secondary" }}>
          Theme
        </Typography>
        {["light", "dark", "system"].map((m) => (
          <MenuItem 
            key={m} 
            onClick={() => toggleTheme(m)} 
            selected={mode === m}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
          <LogoutOutlinedIcon />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
