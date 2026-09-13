import React from "react";
import { Alert, Button, CircularProgress } from "@mui/material";

// This component acts as an access gatekeeper for table content, checking permissions and handling various UI states before rendering the actual table data.

/**
* @param {Object} props - Component props
* @param {boolean} props.canView - Whether user has permission to view the content
* @param {boolean} props.isLoading - Loading state indicator
* @param {boolean} props.isError - Error state indicator
* @param {Object} props.error - Error object with response data
* @param {boolean} props.isEmpty - Empty state indicator
* @param {string} props.resourceName - Name of the resource for display messages
* @param {Function} props.onRetry - Callback function for retry action
* @param {Function} props.onAdd - Callback function for add action
* @param {React.ReactNode} props.children - Table content to render when no guards apply
* @returns {React.ReactNode} Rendered component based on current state
*/

export default function GuardTableContent({
  canView = true,
  isLoading,
  isError,
  error,
  isEmpty,
  resourceName = "items",
  onRetry,
  onAdd,
  children,
}) {

  // Checks for view permission  
  if (!canView) {
    return (
      <Alert severity="error">
        You do not have permission to view {resourceName}.
      </Alert>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
        <CircularProgress size={28} />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      >
        {error?.response?.data?.message || `Unable to load ${resourceName}. Please try again.`}
      </Alert>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <Alert
        severity="info"
        action={
          onAdd && (
            <Button color="inherit" size="small" onClick={onAdd}>
              Add {resourceName.slice(0, -1)} {/* Removes 's' for singular: "Add user" */}
            </Button>
          )
        }
      >
        No {resourceName} found.
      </Alert>
    );
  }

  // If checks pass, render table
  return children;
}