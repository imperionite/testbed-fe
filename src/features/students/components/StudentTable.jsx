import { useMemo } from 'react';
import { MaterialReactTable } from '@glebcha/material-react-table';
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toSentenceCase } from "../utils/formatters";

export default function StudentTable({ data, onEdit, role }) {
  const columns = useMemo(
    () => {
      const allColumns = [
        { 
          id: 'name',
          header: 'Name',
          accessorFn: (row) => {
            const firstName = row.firstName || row.first_name || "";
            const middleName = row.middleName || row.middle_name || "";
            const lastName = row.lastName || row.last_name || "";

            const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

            if (!fullName.trim()) return row.student_number || "N/A";
            return fullName;
          },
          size: 200,
        },
        { accessorKey: 'student_number', header: 'Student ID' },
        { accessorKey: 'program', header: 'Program' },
        { accessorKey: 'year_level', header: 'Year' },
        { accessorKey: 'section', header: 'Section' },
        { accessorKey: 'contact_number', header: 'Contact' },
        { accessorKey: 'address', header: 'Address' },
        { accessorKey: 'emergency_contact_name', header: 'Emergency Contact' },
        { accessorKey: 'emergency_contact_number', header: 'Emergency Phone' },
        { accessorKey: 'internship_status', header: 'Internship Status', Cell: ({ cell }) => toSentenceCase(cell.getValue()) },
        {
          id: 'actions',
          header: 'Actions',
          Cell: ({ row }) => (
            <IconButton onClick={() => onEdit(row.original)}>
              <EditIcon />
            </IconButton>
          ),
        },
      ];

      const isStaff = ["administrator", "internship_coordinator", "hte_supervisor"].includes(role);

      if (!isStaff) {
        return allColumns.filter(col => 
          ['student_number', 'contact_number', 'address', 'emergency_contact_name', 'emergency_contact_number', 'actions'].includes(col.accessorKey || col.id)
        );
      }
      return allColumns;
    },
    [onEdit, role],
  );


  return (
    <MaterialReactTable 
      columns={columns}
      data={data || []}
      initialState={{ pagination: {pageSize: 25, pageIndex: 0}, columnPinning: { right: ['actions'] } }}
      enableStickyHeader
      enableColumnPinning
      muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
    />
  );
} 
 
