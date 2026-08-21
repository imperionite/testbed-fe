import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  TextField, Box, TableSortLabel
} from "@mui/material";

export default function StudentTable({ data }) {
  const [filterText, setFilterText] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("first_name");

  const filteredData = useMemo(() => {
    if (!data) return [];
    const search = filterText.toLowerCase();
    return data.filter((s) =>
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(search) ||
      s.email?.toLowerCase().includes(search)
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
    return <Paper sx={{ p: 2, textAlign: "center" }}>No students found.</Paper>;
  }

  return (
    <Box>
      <TextField
        label="Search Student"
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
                { id: 'first_name', label: 'Name' },
                { id: 'email', label: 'Email' },
                { id: 'program', label: 'Program' },
                { id: 'year_level', label: 'Year Level' },
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
            {sortedData.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>{student.year_level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
