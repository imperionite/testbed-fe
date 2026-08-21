import { Button } from '@mui/material';

export default function DarkButton({ 
  icon,
  children, 
  variant = 'contained',
  size = 'medium',
  disabled = false,
  onClick,
  sx = {},
  ...props 
}) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      sx={{
        backgroundColor: 'primary.dark',
        color: 'primary.contrastText',
        '&:hover': {
          backgroundColor: 'primary.light',
        },
        '&:active': {
          backgroundColor: 'primary.main',
        },
        '&:disabled': {
          backgroundColor: 'secondary.main',
          color: 'text.primary',
        },
        textTransform: 'none',
        fontWeight: 500,
        ...sx
      }}
      startIcon={icon}
      {...props}
    >
      {children}
    </Button>
  );
}
