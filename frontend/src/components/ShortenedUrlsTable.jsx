import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

const ShortenedUrlsTable = ({ links }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Short URL</TableCell>
        <TableCell>Original URL</TableCell>
        <TableCell>Created At</TableCell>
        <TableCell>Expiry</TableCell>
        <TableCell>Click Count</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {links.map((link, idx) => (
        <TableRow key={idx}>
          <TableCell>{link.shortLink}</TableCell>
          <TableCell>{link.originalUrl}</TableCell>
          <TableCell>{link.createdAt}</TableCell>
          <TableCell>{link.expiry}</TableCell>
          <TableCell>{link.clickCount || 0}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ShortenedUrlsTable;
