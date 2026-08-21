import {
  Box,
  Divider,
  Drawer,
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
    label: "User & Roles",
    path: "/userandroles",
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

export default function Sidebar({ role, mobileOpen, onMobileClose }) {
  const allowedItems = menuItems.filter((item) => item.roles.includes(role));

  const navigation = (
    <Box
      sx={{
        width: { xs: 280, sm: 220, md: 260 },
        flexShrink: 0,
        alignSelf: "stretch",
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        height: "100%",
      }}
    >
      <List>
        {allowedItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            onClick={onMobileClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />
    </Box>
  );

  return (
    <>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>{navigation}</Box>
      <Drawer
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {navigation}
      </Drawer>
    </>
  );
}
