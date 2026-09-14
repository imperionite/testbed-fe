import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";

export default function ReportSummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    { label: "Total Internships", value: summary.totalInternships },
    { label: "Pending", value: summary.pending },
    { label: "Active", value: summary.active },
    { label: "Completed", value: summary.completed },
    { label: "Total Required Hours", value: summary.totalRequiredHours },
    { label: "Total Rendered Hours", value: summary.totalRenderedHours },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="subtitle2" color="text.secondary">{card.label}</Typography>
            <Typography variant="h5" fontWeight="bold">{card.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
