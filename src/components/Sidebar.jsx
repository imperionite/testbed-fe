import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";

import { Link } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    roles: [
      "administrator",
      "internship_coordinator",
      "faculty_adviser",
      "student",
      "hte_supervisor",
    ],
  },

  {
    label: "Users",
    path: "/users",
    icon: <PeopleIcon />,
    roles: ["administrator"],
  },

  {
    label: "Companies",
    path: "/companies",
    icon: <BusinessIcon />,
    roles: ["administrator", "internship_coordinator"],
  },
];

export default function Sidebar({ role }) {
  const allowedItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <Box
      sx={{
        width: 260,
        height: "100%",
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <List>
        {allowedItems.map((item) => (
          <ListItemButton key={item.path} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />
    </Box>
  );
}
