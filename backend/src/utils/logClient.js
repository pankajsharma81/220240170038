const https = require('https');
const { URL } = require('url');
const LOG_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';

const allowedStacks = new Set(['backend', 'frontend']);
const allowedLevels = new Set(['debug', 'info', 'warn', 'error', 'fatal']);
const allowedPackages = new Set([
  // backend-only
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service',
  // frontend-only
  'api', 'component', 'hook', 'page', 'state', 'style',
  // shared
  'auth', 'config', 'middleware', 'utils'
]);

function isLowercase(value) {
  return typeof value === 'string' && value === value.toLowerCase();
}

async function log(stack, level, pkg, message) {
  try {
    if (!isLowercase(stack) || !isLowercase(level) || !isLowercase(pkg)) {
      throw new Error('stack, level and package must be lowercase');
    }
    if (!allowedStacks.has(stack)) {
      throw new Error(`invalid stack: ${stack}`);
    }
    if (!allowedLevels.has(level)) {
      throw new Error(`invalid level: ${level}`);
    }
    if (!allowedPackages.has(pkg)) {
      throw new Error(`invalid package: ${pkg}`);
    }

    const token = process.env.EVAL_ACCESS_TOKEN || process.env.ACCESS_TOKEN || '';
    if (!token) {
      // Non-fatal: fall back to console logging
      console.warn('[logClient] Missing EVAL_ACCESS_TOKEN; falling back to console only');
      console.log(JSON.stringify({ stack, level, package: pkg, message }));
      return;
    }

    await new Promise((resolve) => {
      try {
        const url = new URL(LOG_ENDPOINT);
        const isHttps = url.protocol === 'https:';
        const options = {
          hostname: url.hostname,
          port: url.port || (isHttps ? 443 : 80),
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 3000
        };
        const req = (isHttps ? require('https') : require('http')).request(options, (res) => {
          // Drain response
          res.on('data', () => {});
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 400) {
              console.warn(`[logClient] remote log failed: ${res.statusCode}`);
            }
            resolve();
          });
        });
        req.on('error', (e) => {
          console.warn('[logClient] request error', e.message);
          resolve();
        });
        req.write(JSON.stringify({ stack, level, package: pkg, message }));
        req.end();
      } catch (e) {
        console.warn('[logClient] unexpected error', e.message);
        resolve();
      }
    });
  } catch (err) {
    console.error('[logClient] error', err.message);
  }
}

module.exports = { log };


