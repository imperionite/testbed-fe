import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import { Link } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlinedIcon />,
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
    icon: <ManageAccountsOutlinedIcon />,
    roles: ["administrator"],
  },

  {
    label: "Companies",
    path: "/companies",
    icon: <BusinessOutlinedIcon />,
    roles: ["administrator", "internship_coordinator"],
  },

  {
    label: "Students",
    path: "/students",
    icon: <SchoolOutlinedIcon />,
    roles: ["administrator", "internship_coordinator", "student"],
  },
];

export default function Sidebar({ role, mobileOpen, onMobileClose }) {
  const allowedItems = menuItems.filter((item) => item.roles.includes(role));

  const navigation = (
    <Box
      sx={{
        width: { xs: 20, sm: 220, md: 230 },
        flexShrink: 0,
        alignSelf: "stretch",
        borderRight: 1,
        borderColor: "divider",
        height: "100%",
        backgroundColor: "background.accent",
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
            <ListItemIcon sx={{ color: "text.secondary" }}>
              {item.icon}
            </ListItemIcon>

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
