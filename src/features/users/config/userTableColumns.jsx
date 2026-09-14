import { MenuItem } from "@mui/material";
import BadgeRole from "../components/BadgeRole";
import BadgeStatus from "../components/BadgeStatus";
import { ROLE_OPTIONS } from "../../shared/constants/constants";
import { formatUserDate } from "../../shared/fieldFormatters";

//-----------------
// HELPERS
//-----------------

const formatRole = (role) =>
  ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;

const defaultCallEmptyStateValue = "–";

//-----------------
// MAIN FUNCTION
//-----------------
export function createUserTableColumns({ canEdit }) {
  return [
    {
      accessorKey: "email",
      header: "Email",
      size: 200,
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
      id: "firstName",
      header: "First Name",
      size: 150,
      accessorFn: (row) => row.firstName || defaultCallEmptyStateValue,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      id: "lastName",
      header: "Last Name",
      size: 150,
      accessorFn: (row) => row.lastName || defaultCallEmptyStateValue,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      id: "middleName",
      header: "Middle Name",
      size: 150,
      accessorFn: (row) => row.middleName || defaultCallEmptyStateValue,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      id: "suffix",
      header: "Suffix",
      size: 100,
      accessorFn: (row) => row.suffix || defaultCallEmptyStateValue,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: "role",
      header: "Role",
      size: 150,
      filterVariant: "select",
      filterSelectOptions: ROLE_OPTIONS,
      Cell: ({ cell }) => <BadgeRole value={formatRole(cell.getValue())} /> || defaultCallEmptyStateValue,
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
      header: "Account Status",
      size: 120,
      filterVariant: "select",
      filterSelectOptions: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
      Cell: ({ cell }) => (
        <BadgeStatus value={cell.getValue() ? "Active" : "Inactive"} />
      ) || defaultCallEmptyStateValue,
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
      accessorFn: (row) => formatUserDate(row.createdAt) || defaultCallEmptyStateValue,
      header: "Created",
      size: 130,
      enableColumnFilter: true,
      enableEditing: false,
      sortingFn: "datetime", // Ensures chronological sorting
    },
  ];
}
