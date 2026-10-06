import { useState } from 'react'
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.webp'
import { useThemeContext } from '../providers/ThemeContext'

export default function Header() {
  const { mode, toggleTheme } = useThemeContext()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 1.5, sm: 3 },
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="SBIMS"
            sx={{
              height: 50,
              width: 'auto',
            }}
          />
        </Box>

        {/* Theme Selector Burger Menu Button */}
        <Box>
          <IconButton size="small" onClick={handleOpen} aria-label="Open theme selection menu">
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: { mt: '14px', minWidth: '160px' },
              },
            }}
          >
            <Typography
              variant="overline"
              sx={{ px: 2, display: 'block', color: 'text.secondary' }}
            >
              Theme
            </Typography>
            {['light', 'dark', 'system'].map((m) => (
              <MenuItem
                key={m}
                onClick={() => {
                  toggleTheme(m)
                  handleClose()
                }}
                selected={mode === m}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
