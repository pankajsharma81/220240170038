import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

const StatsPage = ({ stats }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Timestamp</TableCell>
        <TableCell>Source</TableCell>
        <TableCell>Location</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {stats.map((click, idx) => (
        <TableRow key={idx}>
          <TableCell>{click.timestamp}</TableCell>
          <TableCell>{click.source}</TableCell>
          <TableCell>{click.location}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default StatsPage;
