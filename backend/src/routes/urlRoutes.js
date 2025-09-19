const express = require('express');
const router = express.Router();
const { createShortUrl, getUrlStats, redirectToOriginal } = require('../controllers/urlController');

router.post('/shorturls', createShortUrl);

router.get('/shorturls/:shortcode', getUrlStats);

router.get('/:shortcode', redirectToOriginal);

module.exports = router;
