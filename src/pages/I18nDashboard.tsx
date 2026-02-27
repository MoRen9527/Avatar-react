import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Paper } from '@mui/material';

interface PendingItem {
  file: string;
  keyPath: string;
  zh: string;
  value: string;
}

const I18nDashboard: React.FC = () => {
  const [lang, setLang] = useState('en');
  const [items, setItems] = useState<PendingItem[]>([]);
  const [editing, setEditing] = useState<Record<string, string>>({});

  const serverBase = import.meta.env.VITE_I18N_SERVER_BASE || 'http://localhost:4175';

  const load = async () => {
    const res = await fetch(`${serverBase}/i18n/pending?lang=${lang}`);
    const data = await res.json();
    setItems(data);
    const map: Record<string, string> = {};
    (data as PendingItem[]).forEach((it) => {
      map[`${it.file}|${it.keyPath}`] = it.value.replace(/^\[PENDING\]\s*/, '');
    });
    setEditing(map);
  };

  useEffect(() => {
    void load();
  }, [lang]);

  const handleSave = async (item: PendingItem) => {
    const key = `${item.file}|${item.keyPath}`;
    const newVal = editing[key] ?? item.value;
    await fetch(`${serverBase}/i18n/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang, file: item.file, keyPath: item.keyPath, value: newVal })
    });
    void load();
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        I18n Translation Dashboard
      </Typography>
      <Box display="flex" alignItems="center" mb={2} gap={2}>
        <Typography>Target language:</Typography>
        <Select size="small" value={lang} onChange={(e) => setLang(e.target.value)}>
          <MenuItem value="en">English</MenuItem>
        </Select>
        <Button variant="outlined" onClick={() => void load()}>Refresh</Button>
      </Box>
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>File</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Chinese (zh)</TableCell>
              <TableCell>Translation ({lang})</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const key = `${item.file}|${item.keyPath}`;
              return (
                <TableRow key={key}>
                  <TableCell>{item.file}</TableCell>
                  <TableCell>{item.keyPath}</TableCell>
                  <TableCell>{item.zh}</TableCell>
                  <TableCell sx={{ minWidth: 260 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editing[key] ?? ''}
                      onChange={(e) => setEditing((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="contained" size="small" onClick={() => void handleSave(item)}>
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No pending items.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default I18nDashboard;
