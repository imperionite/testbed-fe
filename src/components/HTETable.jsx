import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Chip, TextField, Box, TableSortLabel
} from "@mui/material";

export default function HTETable({ data }) {
  const [filterText, setFilterText] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("company_name");

  const filteredData = useMemo(() => {
    if (!data) return [];
    const search = filterText.toLowerCase();
    return data.filter((hte) =>
      hte.company_name?.toLowerCase().includes(search) ||
      hte.address?.toLowerCase().includes(search)
    );
  }, [data, filterText]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, order, orderBy]);

  const handleSort = (property) => {
    setOrder(orderBy === property && order === "asc" ? "desc" : "asc");
    setOrderBy(property);
  };

  if (!data || data.length === 0) {
    return <Paper sx={{ p: 2, textAlign: "center" }}>No companies found.</Paper>;
  }

  return (
    <Box>
      <TextField
        label="Search Company"
        variant="outlined"
        size="small"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        sx={{ mb: 2, width: '300px' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { id: 'company_name', label: 'Company Name' },
                { id: 'address', label: 'Address' },
                { id: 'contact_person', label: 'Contact Person' },
                { id: 'contact_email', label: 'Email' },
              ].map((headCell) => (
                <TableCell key={headCell.id}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((hte) => (
              <TableRow key={hte.id}>
                <TableCell>{hte.company_name}</TableCell>
                <TableCell>{hte.address}</TableCell>
                <TableCell>{hte.contact_person}</TableCell>
                <TableCell>{hte.contact_email}</TableCell>
                <TableCell>
                  <Chip 
                    label={hte.is_active ? "Active" : "Inactive"} 
                    color={hte.is_active ? "success" : "default"} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
