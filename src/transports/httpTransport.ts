import { addTrackingToItems } from './common';

const createTransport = (opts) => {
  const {
    serviceUrl,
    appId,
    sessionId
  } = opts;

  const logPersister = (logQueue) => {
    const logQueueWithTracking = addTrackingToItems(logQueue, appId, sessionId);
    
    // TODO: accept config
    return fetch(serviceUrl, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify(logQueueWithTracking),
    });
  };

  // TODO: accept config
  const logRetreaver = (opts = {}) => {
    return fetch(`${serviceUrl}?sessionId=${sessionId}`, {
      headers: {
        'Content-Type': `application/json`,
      },
    }).then(resp => resp.json());
  };
}

export default createTransport;