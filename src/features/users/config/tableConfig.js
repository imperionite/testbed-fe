/**
 * Base configuration shared across all features (Users, HTEs, Students) [8]
 */
export const defaultTableConfig = {
  enableSorting: true,
  enableColumnFilters: true,
  enableGlobalFilter: true,
  enablePagination: true,
  enableHiding: true,
  enableGrouping: true,
  enableColumnOrdering: true,
  enableClickToCopy: true,
  enableColumnActions: false,
  enableColumnPinning: true,
  enableRowActions: false,
  enableDensityToggle: true,
  enableStickyHeader: true,
  enableStickyFooter: true,
  positionActionsColumn: "last",
  positionGlobalFilter: "right",

  columnFiltersOpen: false,
  pagination: { pageIndex: 0, pageSize: 5 },
  sorting: [{ id: "createdAt", desc: true }], // Sorting by newest createdAt first

  // Action column sizing configurations
  displayColumnDefOptions: {
    "mrt-row-actions": {
      size: 105,
      muiTableBodyCellProps: {
        sx: {
          minWidth: 70,
          whiteSpace: "nowrap",
        },
      },
    },
  },

};

/**
 * User-specific table overrides, sorting configurations, and initial state
 */
export const userTableConfig = {
  ...defaultTableConfig,
  // editDisplayMode: "row",
  initialState: {
    columnPinning: {
      right: ["mrt-row-actions"],
    },
    columnOrder: [
      "email",
      "firstName",
      "lastName",
      "middleName",
      "suffix",
      "role",
      "isActive",
      "createdAt",
      "mrt-row-actions",
    ],
  },
};
