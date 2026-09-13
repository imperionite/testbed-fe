import { MenuItem } from "@mui/material";
import BadgeStatus from "./BadgeStatus";

//-----------------
// HELPERS
//-----------------

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
export function createHteTableColumns({ canEdit, supervisorMap = {} }) {
  return [
    {
      accessorKey: "company_name",
      header: "Company Name",
      size: 260,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: "address",
      header: "Address",
      size: 200,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: "contact_person",
      header: "Contact Person",
      size: 200,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: "contact_email",
      header: "Contact Email",
      size: 220,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: "contact_number",
      header: "Contact Number",
      size: 160,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: "supervisor_id",
      header: "Supervisor",
      size: 200,
      enableColumnFilter: true,
      enableEditing: false,
      Cell: ({ cell }) => {
        const id = cell.getValue();
        if (!id) return "No Supervisor";
        return supervisorMap[id] ?? id;
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
