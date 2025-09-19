const LOG_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';

async function log(stack, level, pkg, message, accessToken) {
  try {
    await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ stack, level, package: pkg, message })
    });
  } catch (e) {
    console.warn('[frontend log] failed', e.message);
  }
}

const loggingMiddleware = (accessToken) => next => action => {
  log('frontend', 'debug', 'state', `action: ${action.type}`, accessToken);
  return next(action);
};

export { log };
export default loggingMiddleware;
