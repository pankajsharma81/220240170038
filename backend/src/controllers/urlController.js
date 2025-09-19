const generateShortcode = require('../utils/shortcodeGenerator');
const { log } = require('../utils/logClient');

let urlDatabase = {}; // Example in-memory store: { shortcode: { originalUrl, createdAt, expiry, clicks: [] } }

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

exports.createShortUrl = (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !isValidUrl(url)) {
    log('backend', 'error', 'handler', 'invalid or missing url');
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  // If user provided a specific shortcode, enforce uniqueness strictly
  if (shortcode) {
    if (urlDatabase[shortcode]) {
      log('backend', 'warn', 'handler', `duplicate shortcode requested: ${shortcode}`);
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
  }

  // Generate a unique shortcode, retrying a few times on rare collisions
  let finalShortcode = shortcode || generateShortcode();
  if (!shortcode) {
    let safetyCounter = 0;
    while (urlDatabase[finalShortcode] && safetyCounter < 5) {
      finalShortcode = generateShortcode();
      safetyCounter += 1;
    }
    if (urlDatabase[finalShortcode]) {
      log('backend', 'error', 'service', 'failed to generate unique shortcode');
      return res.status(500).json({ error: 'Failed to generate unique shortcode' });
    }
  }

  const createdAt = new Date();
  const expiry = new Date(createdAt.getTime() + validity * 60000); // validity in minutes

  urlDatabase[finalShortcode] = {
    originalUrl: url,
    createdAt: createdAt.toISOString(),
    expiry: expiry.toISOString(),
    clicks: []
  };

  log('backend', 'info', 'service', `short url created: ${finalShortcode}`);
  return res.status(201).json({
    shortLink: `${req.protocol}://${req.get('host')}/${finalShortcode}`,
    originalUrl: url,
    createdAt: createdAt.toISOString(),
    expiry: expiry.toISOString()
  });
};

exports.getUrlStats = (req, res) => {
  const { shortcode } = req.params;
  const entry = urlDatabase[shortcode];

  if (!entry) {
    log('backend', 'warn', 'handler', `stats requested for missing shortcode: ${shortcode}`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  return res.json({
    totalClicks: entry.clicks.length,
    originalUrl: entry.originalUrl,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    clickData: entry.clicks
  });
};

exports.redirectToOriginal = (req, res) => {
  const { shortcode } = req.params;
  const entry = urlDatabase[shortcode];
  if (!entry) {
    log('backend', 'warn', 'route', `redirect for missing shortcode: ${shortcode}`);
    return res.status(404).send('Shortcode not found');
  }

  const now = new Date();
  if (new Date(entry.expiry) < now) {
    log('backend', 'info', 'route', `expired shortcode accessed: ${shortcode}`);
    return res.status(410).send('Short URL expired');
  }

  entry.clicks.push({
    timestamp: now.toISOString(),
    source: req.get('referer') || 'direct',
    location: req.ip // Assuming IP-based location; geo lookup can be added
  });

  log('backend', 'info', 'route', `redirecting ${shortcode} -> ${entry.originalUrl}`);
  return res.redirect(entry.originalUrl);
};
