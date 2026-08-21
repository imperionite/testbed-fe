import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Chip, TextField, Box, TableSortLabel
} from "@mui/material";

export default function InternshipTable({ data }) {
  const [filterText, setFilterText] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("studentId");

  const filteredData = useMemo(() => {
    if (!data) return [];
    const search = filterText.toLowerCase();
    return data.filter((i) =>
      i.studentId?.toString().includes(filterText) ||
      i.hteId?.toString().includes(filterText) ||
      i.status?.toLowerCase().includes(search)
    );
  }, [data, filterText]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal = a[orderBy] ?? "";
      let bVal = b[orderBy] ?? "";
      
      if (orderBy === 'requiredHours') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }
      
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, order, orderBy]);

  const handleSort = (property) => {
    setOrder(orderBy === property && order === "asc" ? "desc" : "asc");
    setOrderBy(property);
  };

  const getStatusColor = (status) => {
    const map = { active: "success", pending: "warning", completed: "default" };
    return map[status] || "default";
  };

  if (!data || data.length === 0) {
    return <Paper sx={{ p: 2, textAlign: "center" }}>No internships found.</Paper>;
  }

  return (
    <Box>
      <TextField
        label="Search Internship"
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
                { id: 'studentId', label: 'Student ID' },
                { id: 'hteId', label: 'HTE ID' },
                { id: 'status', label: 'Status' },
                { id: 'requiredHours', label: 'Required Hours' },
              ].map((headCell) => (
                <TableCell key={headCell.id} align={headCell.id === 'requiredHours' ? 'right' : 'left'}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((internship) => (
              <TableRow key={internship.id}>
                <TableCell>{internship.studentId}</TableCell>
                <TableCell>{internship.hteId}</TableCell>
                <TableCell>
                  <Chip 
                    label={internship.status} 
                    color={getStatusColor(internship.status)} 
                    size="small" 
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align="right">{internship.requiredHours || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
