import { useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { createUserTableColumns } from "./userTableColumns";
import notify from "../../../utils/toast";
import ActionConfirmDialog from "../../../components/common/ActionConfirmDialog";
import RoleChooserDialog from "./RoleChooserDialog";

export default function UsersTable({
  users,
  permissions,
  onRoleChange,
  onStatusChange,
  onBulkRoleChange,
  onBulkStatusChange,
  onUserClick,
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [roleChooserOpen, setRoleChooserOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const resolveRole = useRef(null);

  const askForConfirmation = (message) =>
    new Promise((resolve) => {
      setConfirmation({ message, resolve });
    });

  const closeConfirmation = (confirmed) => {
    confirmation?.resolve(confirmed);
    setConfirmation(null);
  };

  const chooseRole = () => {
    setSelectedRole("");
    setRoleChooserOpen(true);
    return new Promise((resolve) => {
      resolveRole.current = resolve;
    });
  };

  const resolveRoleChooser = (role) => {
    resolveRole.current?.(role);
    resolveRole.current = null;
    setRoleChooserOpen(false);
  };

  const columns = useMemo(
    () =>
      createUserTableColumns({
        canEdit: permissions.canEdit,
      }),
    [permissions.canEdit],
  );

  const selectedRowCount = Object.keys(rowSelection).length;

  const table = useMaterialReactTable({
    columns,
    data: users,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableRowSelection: permissions.canSelectRows,
    enableHiding: false,
    enableClickToCopy: true,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableDensityToggle: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableEditing: permissions.canEdit,
    editDisplayMode: "row",
    positionActionsColumn: "last",
    positionGlobalFilter: "right",
    icons: {
      SaveIcon: (props) => (
        <CheckIcon
          {...props}
          sx={{ ...props.sx, color: "success.main" }}
        />
      ),
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 104,
        muiTableBodyCellProps: {
          sx: {
            minWidth: 104,
            whiteSpace: "nowrap",
          },
        },
      },
    },
    state: {
      rowSelection,
      columnVisibility: {
        "mrt-row-actions": selectedRowCount === 0,
      },
    },
    onRowSelectionChange: setRowSelection,
    onEditingRowSave: permissions.canEdit
      ? async ({ exitEditingMode, row, values }) => {
          const roleChanged = values.role !== row.original.role;
          const statusChanged =
            String(values.is_active) !== String(row.original.is_active);

          if (!roleChanged && !statusChanged) {
            exitEditingMode();
            return;
          }

          if (!(await askForConfirmation("Are you sure you want to save these changes?"))) {
            return;
          }

          try {
            if (roleChanged) {
              await onRoleChange({ id: row.original.id, role: values.role });
            }
            if (statusChanged) {
              await onStatusChange({
                id: row.original.id,
                isActive: values.is_active === true || values.is_active === "true",
              });
            }
            exitEditingMode();
            notify.success("User updated successfully.");
          } catch (error) {
            console.error("Failed to update user:", error);
            notify.error(
              error.response?.data?.message || "Failed to update user.",
            );
          }
        }
      : undefined,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 25 },
      sorting: [{ id: "created_at", desc: true }],
      showColumnFilters: true,
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 600,
        maxWidth: "100%",
        overflowX: "auto",
        backgroundColor: "background.paper",
      },
    },
    // muiTopToolbarProps: {
    //   sx: {
    //     backgroundColor: "secondary.light",
    //   },
    // },
    // muiBottomToolbarProps: {
    //   sx: {
    //     backgroundColor: "secondary.light",
    //   },
    // },
    muiTableProps: {
      sx: {
        tableLayout: "fixed",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        position: "sticky",
        top: 0,
        zIndex: 2,
        // backgroundColor: "background.paper",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: "background.paper",
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        if (
          event.target.closest("button") ||
          event.target.closest("input") ||
          event.target.closest('[role="checkbox"]')
        ) {
          return;
        }

        onUserClick?.(row.original);
      },
      sx: {
        cursor: onUserClick ? "pointer" : "default",
        backgroundColor: "background.paper",
      },
    }),
    renderBottomToolbarCustomActions: ({ table: currentTable }) =>
      permissions.canBulkEdit ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            disabled={!currentTable.getSelectedRowModel().rows.length}
            onClick={async () => {
              const role = await chooseRole();
              if (!role) return;
              if (!(await askForConfirmation("Are you sure you want to change the selected users' roles?"))) {
                return;
              }

              const ids = currentTable
                .getSelectedRowModel()
                .rows.map((row) => row.original.id);

              onBulkRoleChange({ ids, role })
                .then(() => notify.success("Roles updated successfully."))
                .catch((error) => {
                  console.error("Failed to update roles:", error);
                  notify.error("Failed to update roles.");
                });
            }}
          >
            Change role
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={!currentTable.getSelectedRowModel().rows.length}
            onClick={async () => {
              if (!(await askForConfirmation("Are you sure you want to activate the selected users?"))) {
                return;
              }

              const ids = currentTable
                .getSelectedRowModel()
                .rows.map((row) => row.original.id);

              onBulkStatusChange({ ids, isActive: true })
                .then(() => notify.success("Users activated successfully."))
                .catch((error) => {
                  console.error("Failed to activate users:", error);
                  notify.error(
                    error.response?.data?.message || "Failed to activate users.",
                  );
                });
            }}
          >
            Activate
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={!currentTable.getSelectedRowModel().rows.length}
            onClick={async () => {
              if (!(await askForConfirmation("Are you sure you want to deactivate the selected users?"))) {
                return;
              }

              const ids = currentTable
                .getSelectedRowModel()
                .rows.map((row) => row.original.id);

              onBulkStatusChange({ ids, isActive: false })
                .then(() => notify.success("Users deactivated successfully."))
                .catch((error) => {
                  console.error("Failed to deactivate users:", error);
                  notify.error(
                    error.response?.data?.message || "Failed to deactivate users.",
                  );
                });
            }}
          >
            Deactivate
          </Button>
        </Box>
      ) : null,
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <ActionConfirmDialog
        open={Boolean(confirmation)}
        message={confirmation?.message}
        onConfirm={() => closeConfirmation(true)}
        onCancel={() => closeConfirmation(false)}
      />
      <RoleChooserDialog
        open={roleChooserOpen}
        value={selectedRole}
        onChange={setSelectedRole}
        onConfirm={() => resolveRoleChooser(selectedRole)}
        onCancel={() => resolveRoleChooser(null)}
      />
    </>
  );
}
