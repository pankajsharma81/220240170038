const crypto = require('crypto');

function generateShortcode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortcode = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    shortcode += chars[randomIndex];
  }
  return shortcode;
}

module.exports = generateShortcode;
