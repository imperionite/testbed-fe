import {
  Box, Divider, List, ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, roles: ["administrator", "internship_coordinator", "faculty_adviser", "student", "hte_supervisor"] },
  { label: "Internships", path: "/internships", icon: <AssignmentIcon />, roles: ["administrator", "internship_coordinator", "faculty_adviser"] },
  { label: "Students", path: "/students", icon: <PeopleIcon />, roles: ["administrator", "internship_coordinator"] },
  { label: "Users", path: "/users", icon: <PeopleIcon />, roles: ["administrator"] },
  { label: "Companies", path: "/companies", icon: <BusinessIcon />, roles: ["administrator", "internship_coordinator"] },
  { label: "Attendance", path: "/attendance", icon: <AssignmentIcon />, roles: ["administrator", "internship_coordinator", "student", "hte_supervisor"] },
];

export default function Sidebar({ role }) {
  const location = useLocation();
  const allowedItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <Box sx={{ width: 260, height: "100%", borderRight: 1, borderColor: "divider", bgcolor: "background.paper" }}>
      <List>
        {allowedItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton 
              key={item.path} 
              component={Link} 
              to={item.path}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive ? "primary.main" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  "& .MuiTypography-root": {
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "primary.main" : "text.primary"
                  }
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
    </Box>
  );
}
