import addTrackingToItems from './common';

const createTransport = (opts) => {
  const {
    SERVICE_URL,
    appId,
    sessionId
  } = opts;

  const logPersister = (logQueue) => {
    const logQueueWithTracking = addTrackingToItems(logQueue, appId, sessionId);
    
    // TODO: accept config
    return fetch(SERVICE_URL, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify(logQueueWithTracking),
    });
  };

  // TODO: accept config
  const logRetreaver = (opts = {}) => {
    const {
      sessionId = sessionId,
    } = opts;

    return fetch(`${SERVICE_URL}?sessionId=${sessionId}`, {
      headers: {
        'Content-Type': `application/json`,
      },
    }).then(resp => resp.json());
  };
}

export default createTransport;