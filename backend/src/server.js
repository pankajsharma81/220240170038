const express = require('express');
const cors = require('cors');

const app = express();
const urlRoutes = require('./routes/urlRoutes');
const loggingMiddleware = require('./middlewares/loggingMiddleware');

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

app.use('/', urlRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`URL Shortener service running on port ${PORT}`);
});
