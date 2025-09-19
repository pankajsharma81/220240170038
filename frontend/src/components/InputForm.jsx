import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const InputForm = ({ onShorten }) => {
  const [urls, setUrls] = useState([{ url: '', validity: 30, shortcode: '' }]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleAddField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', validity: 30, shortcode: '' }]);
    }
  };

  const handleShorten = () => {
    onShorten(urls);
  };

  return (
    <Box>
      {urls.map((item, idx) => (
        <Box key={idx} mb={2}>
          <TextField label="Original URL" type="url" required value={item.url}
            onChange={e => handleChange(idx, 'url', e.target.value)} sx={{ mr: 2 }} />
          <TextField label="Validity (min)" type="number" required value={item.validity}
            onChange={e => handleChange(idx, 'validity', e.target.value)} sx={{ mr: 2 }} />
          <TextField label="Shortcode (optional)" value={item.shortcode}
            onChange={e => handleChange(idx, 'shortcode', e.target.value)} sx={{ mr: 2 }} />
        </Box>
      ))}
      <Button variant="contained" onClick={handleAddField}>Add More</Button>
      <Button variant="contained" sx={{ ml: 2 }} onClick={handleShorten}>Shorten URLs</Button>
    </Box>
  );
};

export default InputForm;
