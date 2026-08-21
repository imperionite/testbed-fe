import { MenuItem } from "@mui/material";
import BadgeRole from "./BadgeRole";
import BadgeStatus from "./BadgeStatus";

//-----------------
// HELPERS
//-----------------
const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "administrator", label: "Administrator" },
  { value: "hte_supervisor", label: "HTE Supervisor" },
  { value: "faculty_adviser", label: "Faculty Adviser" },
  { value: "internship_coordinator", label: "Internship Coordinator" },
];

const formatRole = (role) =>
  ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;

const formatCellDate = (value) => {
  if (!value && value !== 0) return null;
  
  try {
    const dateObj = new Date(value);
    
    if (isNaN(dateObj.getTime())) return null;
    
    return new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(dateObj);

  } catch (error) {
    console.error("Date formatting error:", error);
    return null;
  }
};



//-----------------
// MAIN FUNCTION
//-----------------
export function createUserTableColumns({ canEdit }) {
  return [
    {
      accessorKey: "email",
      header: "Email",
      size: 240,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      id: "name",
      header: "Name",
      size: 220,
      accessorFn: (row) =>
        [row.last_name, row.first_name, row.middle_name, row.suffix]
          .filter(Boolean)
          .join(", "),
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: "role",
      header: "Role",
      size: 190,
      filterVariant: "select",
      filterSelectOptions: ROLE_OPTIONS,
      Cell: ({ cell }) => <BadgeRole value={formatRole(cell.getValue())} />,
      enableEditing: canEdit,
      muiEditTextFieldProps: {
        select: true,
        children: ROLE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        )),
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      size: 120,
      filterVariant: "select",
      filterSelectOptions: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
      Cell: ({ cell }) => (
        <BadgeStatus value={cell.getValue() ? "Active" : "Inactive"} />
      ),
      enableEditing: canEdit,
      muiEditTextFieldProps: {
        select: true,
        children: [
          <MenuItem key="active" value={true}>
            Active
          </MenuItem>,
          <MenuItem key="inactive" value={false}>
            Inactive
          </MenuItem>,
        ],
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      size: 130,
      enableColumnFilter: false,
      enableEditing: false,
      Cell: ({ cell }) => formatCellDate(cell.getValue()),
    },
  ];
}

