import React, { useState } from "react";
import { Box, Button, Typography, Stack, Alert, MenuItem, TextField } from "@mui/material";
import { useDocumentMutations } from "../hooks/useDocumentMutations";
import { DOCUMENT_TYPES } from "../../../../../backend/sbims/src/modules/documents/documents.types";

const MAX_FILE_SIZE_MB = 10;

export default function DocumentUploader({ internshipId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [error, setError] = useState(null);
  const { uploadDocument } = useDocumentMutations(internshipId);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !documentType) {
      setError("Please select both a document type and a file.");
      return;
    }

    try {
      await uploadDocument.mutateAsync({ documentType, file });
      setFile(null);
      setDocumentType("");
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.message || "Upload failed.");
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Upload Document</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Stack spacing={2}>
        <TextField
          select
          label="Document Type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          fullWidth
        >
          {DOCUMENT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type.replace(/_/g, " ").toUpperCase()}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" component="label">
          {file ? file.name : "Select File"}
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || !documentType || uploadDocument.isLoading}
        >
          {uploadDocument.isLoading ? "Uploading..." : "Upload"}
        </Button>
      </Stack>
    </Box>
  );
}
