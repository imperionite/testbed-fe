import React from "react";
import { Box, Typography, Stack, IconButton, Tooltip, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { documentsApi } from "../../../api/documents";

export default function DocumentItem({ document, onApprove, onReject }) {
  const handleDownload = async () => {
    try {
      const { url } = await documentsApi.getDocumentDetails(document.id);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to fetch download URL:", err);
    }
  };

  const isPending = document.status === "pending";

  return (
    <Box sx={{ p: 1.5, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Stack>
        <Typography variant="body1" fontWeight="bold">
          {document.document_type.replace(/_/g, " ").toUpperCase()}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {document.file_name} • {new Date(document.uploaded_at).toLocaleDateString()}
          {document.rejection_reason && (
            <Typography variant="caption" color="error" display="block">
              Reason: {document.rejection_reason}
            </Typography>
          )}
        </Typography>
      </Stack>
      
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" sx={{ 
            px: 1, 
            borderRadius: 1, 
            backgroundColor: document.status === "approved" ? "success.light" : document.status === "rejected" ? "error.light" : "info.light",
            color: "white"
        }}>
          {document.status.toUpperCase()}
        </Typography>
        
        {isPending && onApprove && onReject && (
            <>
                <Button size="small" variant="outlined" color="success" onClick={() => onApprove(document.id)} startIcon={<CheckIcon />}>Approve</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => onReject(document.id)} startIcon={<CloseIcon />}>Reject</Button>
            </>
        )}

        <Tooltip title="Download/View">
          <IconButton onClick={handleDownload} size="small">
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
