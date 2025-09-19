const generateShortcode = require('../utils/shortcodeGenerator');

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
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  // If user provided a specific shortcode, enforce uniqueness strictly
  if (shortcode) {
    if (urlDatabase[shortcode]) {
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
    return res.status(404).send('Shortcode not found');
  }

  const now = new Date();
  if (new Date(entry.expiry) < now) {
    return res.status(410).send('Short URL expired');
  }

  entry.clicks.push({
    timestamp: now.toISOString(),
    source: req.get('referer') || 'direct',
    location: req.ip // Assuming IP-based location; geo lookup can be added
  });

  return res.redirect(entry.originalUrl);
};
