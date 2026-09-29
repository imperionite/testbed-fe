// import {
//   ViewListOutlined,
//   FullscreenOutlined,
//   FullscreenExitOutlined,
//   VisibilityOutlined,
//   FilterListOutlined,
//   SortOutlined,
//   MoreVertOutlined,
//   SearchOutlined,
//   ClearOutlined,
//   ArrowDownwardOutlined,
//   DensityMediumOutlined,
// } from '@mui/icons-material'
// import EditIcon from '@mui/icons-material/Edit'

/**
 * Base configuration shared across all features (Users, HTEs, Students)
 */
export const defaultTableConfig = {
  autoResetPageIndex: false, //!Important
  enableSorting: true,
  enableColumnFilters: true,
  enableGlobalFilter: true,
  enablePagination: true,
  enableHiding: true,
  enableGrouping: true,
  enableColumnOrdering: true,
  enableColumnPinning: true,
  enableDensityToggle: true,
  enableStickyHeader: true,
  enableStickyFooter: true,
  positionActionsColumn: 'last',
  positionGlobalFilter: 'right',

  muiCircularProgressProps: { color: 'secondary' },
  muiSkeletonProps: { animation: 'wave' },

  // icons: {
  //   EditIcon: EditIcon,
  //   ViewListIcon: ViewListOutlined,
  //   FullscreenIcon: FullscreenOutlined,
  //   FullscreenExitIcon: FullscreenExitOutlined,
  //   VisibilityIcon: VisibilityOutlined,
  //   FilterListIcon: FilterListOutlined,
  //   SortIcon: SortOutlined,
  //   MoreVertIcon: MoreVertOutlined,
  //   SearchIcon: SearchOutlined,
  //   SearchOffIcon: ClearOutlined,
  //   ArrowDownwardIcon: ArrowDownwardOutlined,
  //   DensityMediumIcon: DensityMediumOutlined,
  // },

  initialState: {
    density: 'comfortable',
    pagination: { pageIndex: 0, pageSize: 30 },
    sorting: [{ id: 'created_at', desc: false }],
    columnFiltersOpen: false,
    columnPinning: {
      right: ['mrt-row-actions'],
    },
  },

  // Action column sizing configurations
  displayColumnDefOptions: {
    'mrt-row-actions': {
      size: 80,
      muiTableBodyCellProps: {
        sx: {
          minWidth: 70,
          whiteSpace: 'nowrap',
        },
      },
    },
  },
}
