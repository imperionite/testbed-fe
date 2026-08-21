import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Box,
  TableSortLabel,
} from "@mui/material";

export default function AttendanceTable({ data }) {
  const [filterText, setFilterText] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");

  // Filtering Logic
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((a) =>
      a.studentId?.toString().includes(filterText) ||
      a.hteId?.toString().includes(filterText) ||
      a.status?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [data, filterText]);

  // Sorting Logic
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal = a[orderBy] ?? "";
      let bVal = b[orderBy] ?? "";
      
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, order, orderBy]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "validated": return "success";
      case "pending": return "warning";
      case "rejected": return "error";
      default: return "default";
    }
  };

  if (!data || data.length === 0) {
    return <Paper sx={{ p: 2, textAlign: "center" }}>No attendance records found.</Paper>;
  }

  return (
    <Box>
      <TextField
        label="Search Attendance"
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
                { id: 'timeIn', label: 'Time In' },
                { id: 'timeOut', label: 'Time Out' },
                { id: 'status', label: 'Status' },
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
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell>{attendance.studentId}</TableCell>
                <TableCell>{attendance.hteId}</TableCell>
                <TableCell>{new Date(attendance.timeIn).toLocaleString()}</TableCell>
                <TableCell>{attendance.timeOut ? new Date(attendance.timeOut).toLocaleString() : 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={attendance.status} 
                    color={getStatusColor(attendance.status)} 
                    size="small" 
                    sx={{ textTransform: 'capitalize' }}
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
