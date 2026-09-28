import { useMemo, useState } from 'react'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'
import { Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import { createHteTableColumns } from './hteTableColumns'
import notify from '../../../utils/toast'
import ActionConfirmDialog from '../../shared/components/ActionConfirmDialog'
import { defaultTableConfig } from '../../shared/config/defaultTableConfig'

export default function HtesTable({
  htes,
  permissions,
  supervisorMap = {},
  onBulkStatusChange,
  onHteClick,
}) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({
    // Sets default visibility (false = hidden by default)
    id: false,
  })
  const [confirmation, setConfirmation] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)

  const askForConfirmation = (message) =>
    new Promise((resolve) => {
      setConfirmation({ message, resolve })
    })

  const closeConfirmation = (confirmed) => {
    confirmation?.resolve(confirmed)
    setConfirmation(null)
  }

  const columns = useMemo(
    () =>
      createHteTableColumns({
        canEdit: permissions.canEdit,
        supervisorMap,
      }),
    [permissions.canEdit, supervisorMap],
  )

  const selectedRowCount = Object.keys(rowSelection).length

  const table = useMaterialReactTable({
    ...defaultTableConfig,
    columns,
    data: htes,
    enableRowSelection: permissions.canSelectRows,
    enableEditing: false,
    enableRowActions: permissions.canEdit,
    initialState: {
      ...defaultTableConfig.initialState,
      columnFiltersOpen: false,
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 104,
        muiTableBodyCellProps: {
          sx: {
            minWidth: 104,
            whiteSpace: 'nowrap',
          },
        },
      },
    },
    state: {
      rowSelection,
      columnVisibility: {
        ...columnVisibility,
        'mrt-row-actions': selectedRowCount === 0,
      },
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    renderRowActions: ({ row }) => (
      <Tooltip title="Edit HTE">
        <IconButton
          aria-label={`Edit ${row.original.company_name}`}
          onClick={(event) => {
            event.stopPropagation()
            onHteClick?.(row.original)
          }}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
    muiTableContainerProps: {
      sx: {
        maxHeight: 600,
        maxWidth: '100%',
        overflowX: 'auto',
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: 'fixed',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        position: 'sticky',
        top: 0,
        zIndex: 2,
      },
    },
    renderBottomToolbarCustomActions: ({ table: currentTable }) =>
      permissions.canBulkEdit ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            disabled={!currentTable.getSelectedRowModel().rows.length}
            onClick={async () => {
              if (
                !(await askForConfirmation('Are you sure you want to activate the selected HTEs?'))
              ) {
                return
              }

              const ids = currentTable.getSelectedRowModel().rows.map((row) => row.original.id)

              setPendingAction('bulk-activate')
              try {
                await onBulkStatusChange({ ids, isActive: true })
                notify.success('HTEs activated successfully.')
              } catch (error) {
                console.error('Failed to activate HTE:', error)
                notify.error(error.response?.data?.message || 'Failed to activate HTE.')
              } finally {
                setPendingAction(null)
              }
            }}
            startIcon={pendingAction === 'bulk-activate' ? <CircularProgress size={16} /> : null}
          >
            {pendingAction === 'bulk-activate' ? 'Activating...' : 'Activate'}
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={!currentTable.getSelectedRowModel().rows.length}
            onClick={async () => {
              if (
                !(await askForConfirmation(
                  'Are you sure you want to deactivate the selected HTEs?',
                ))
              ) {
                return
              }

              const ids = currentTable.getSelectedRowModel().rows.map((row) => row.original.id)

              setPendingAction('bulk-deactivate')
              try {
                await onBulkStatusChange({ ids, isActive: false })
                notify.success('HTEs deactivated successfully.')
              } catch (error) {
                console.error('Failed to deactivate HTEs:', error)
                notify.error(error.response?.data?.message || 'Failed to deactivate HTEs.')
              } finally {
                setPendingAction(null)
              }
            }}
            startIcon={pendingAction === 'bulk-deactivate' ? <CircularProgress size={16} /> : null}
          >
            {pendingAction === 'bulk-deactivate' ? 'Deactivating...' : 'Deactivate'}
          </Button>
        </Box>
      ) : null,
  })

  return (
    <>
      <MaterialReactTable table={table} />
      <ActionConfirmDialog
        open={Boolean(confirmation)}
        message={confirmation?.message}
        onConfirm={() => closeConfirmation(true)}
        onCancel={() => closeConfirmation(false)}
      />
    </>
  )
}
