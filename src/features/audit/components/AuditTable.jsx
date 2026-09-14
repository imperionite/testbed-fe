import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "@glebcha/material-react-table";

export default function AuditTable({ data = [] }) {
  const columns = useMemo(
    () => [
      { accessorKey: "created_at", header: "Timestamp", Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString() },
      { accessorKey: "action", header: "Action" },
      { accessorKey: "resource_type", header: "Resource Type" },
      { accessorKey: "resource_id", header: "Resource ID" },
      { accessorKey: "user_id", header: "User ID" },
      { accessorKey: "ip_address", header: "IP Address" },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
  });

  return <MaterialReactTable table={table} />;
}
