import 'isomorphic-fetch';
import { addTrackingToItems } from './common';
import { LogEntry, LogRetreaverFunc, LogPersisterFunc, TransportConfig } from '../types';

interface HttpTransportConfig extends TransportConfig {
  serviceUrl: string;
}

const createTransport = (opts: HttpTransportConfig) => {
  const {
    serviceUrl,
    appId,
    sessionId
  } = opts;

  const logPersister: LogPersisterFunc = (logQueue: LogEntry[]) => {
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
  const logRetreaver: LogPersisterFunc = () => {
    return fetch(`${serviceUrl}?sessionId=${sessionId}`, {
      headers: {
        'Content-Type': `application/json`,
      },
    }).then(resp => resp.json());
  };
};

export default createTransport;