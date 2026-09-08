import { TextField, Select, MenuItem } from '@mui/material';

// Field Renderer Registry matching required inputs
export const fieldRenderers = {
  text: {
    component: TextField,
    shouldRender: () => true,
    getProps: (field) => ({
      label: field.label,
      fullWidth: true,
      variant: 'outlined',
    }),
  },
  email: {
    component: TextField,
    shouldRender: () => true,
    getProps: (field) => ({
      label: field.label,
      type: 'email',
      fullWidth: true,
      variant: 'outlined',
    }),
  },
  select: {
    component: Select,
    shouldRender: () => true,
    getProps: (field) => ({
      label: field.label,
      fullWidth: true,
      children: field.options?.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      )),
    }),
  },
status: {
  component: Select,
  shouldRender: () => true,
  getProps: (field) => {
    return {
      label: field.label || 'Status',
      fullWidth: true,
      children: field.options?.map((opt) => (
        <MenuItem key={String(opt.value)} value={opt.value}>
          {opt.label}
        </MenuItem>
      )),
    };
  },
},
  date: {
    component: TextField,
    shouldRender: () => true,
    getProps: (field) => ({
      label: field.label,
      type: 'date',
      fullWidth: true,
      InputLabelProps: { shrink: true },
    }),
  },
  password: {
    component: TextField,
    shouldRender: () => true,
    getProps: (field) => ({
      label: field.label,
      type: 'password',
      fullWidth: true,
      variant: 'outlined',
    }),
  }
};

/**
 * Get the appropriate renderer for a field type
 * @param {Object} field - Field configuration
 * @returns {Object} Field renderer config
 */
export function getFieldRenderer(field) {
  return fieldRenderers[field.type] || fieldRenderers.text;
}