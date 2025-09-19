const loggingMiddleware = () => next => action => {
  window.LoggingMiddleware?.log(action.type, action.payload);
  return next(action);
};

export default loggingMiddleware;
