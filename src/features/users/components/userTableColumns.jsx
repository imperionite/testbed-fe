import { MenuItem } from "@mui/material";
import BadgeRole from "./BadgeRole";
import BadgeStatus from "./BadgeStatus";
import { ROLE_OPTIONS } from "../form/formConfig";
import { formatUserDate } from "../form/fieldFormatters";

//-----------------
// HELPERS
//-----------------

const formatRole = (role) =>
  ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;

//-----------------
// MAIN FUNCTION
//-----------------
export function createUserTableColumns({ canEdit }) {
  return [
    {
      accessorKey: "email",
      header: "Email",
      size: 220,
      enableColumnFilter: true,
      enableEditing: false,
    },
    // {
    //   id: "name",
    //   header: "Name",
    //   size: 220,
    //   accessorFn: (row) =>
    //     [row.lastName, row.firstName, row.middleName, row.suffix]
    //       .filter(Boolean)
    //       .join(", "),
    //   enableColumnFilter: true,
    //   enableEditing: false,
    // },
    {
      id: "first_name",
      header: "First Name",
      size: 200,
      accessorFn: (row) => row.firstName,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      id: "last_name",
      header: "Last Name",
      size: 180,
      accessorFn: (row) => row.lastName,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      id: "middle_name",
      header: "Middle Name",
      size: 180,
      accessorFn: (row) => row.middleName,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      id: "suffix",
      header: "Suffix",
      size: 100,
      accessorFn: (row) => row.suffix,
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
      accessorKey: "isActive",
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
      id: "createdAt",
      accessorFn: (row) => formatUserDate(row.createdAt),
      header: "Created",
      size: 130,
      enableColumnFilter: true,
      enableEditing: false,
      sortingFn: "datetime", // Ensures chronological sorting instead of alphabetical
    },
  ];
}
