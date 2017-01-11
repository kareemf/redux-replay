import { database } from 'firebase';
import { addTrackingToItems } from './common';
import { LogEntry, LogRetreaverFunc, LogPersisterFunc, TransportConfig, Transport } from '../types';

interface FirebaseTransportConfig extends TransportConfig {
    ref: database.Reference;
    path: string;
}

interface FirebaseLogRetreaverOptions {
  sessionId?: string;
}

const createTransport = (opts: FirebaseTransportConfig) => {
  const {
    ref,
    path,
    appId,
    sessionId
  } = opts;

  const logRetreaver: LogRetreaverFunc = (opts: FirebaseLogRetreaverOptions = {}) => {
    const {  sessionId: targetSessionId } = opts;

    if (!ref) {
      return Promise.reject(`No Firebase DB ref availale`);
    }

    return ref
      .child(path)
      .orderByChild('sessionId')
      .equalTo(targetSessionId || sessionId)
      .once('value')
      .then((snapshot) => {
        const val = snapshot.val();

        if (!val) { return []; }
        // each `push` transaction has its own key - flatten into a single array
        const logEntries: LogEntry[] = Object
          .values(val)
          .reduce((ouput, entries) => ([...ouput, ...entries]), []);

        return logEntries;
      }) as Promise<LogEntry[]>;
  };

  const logPersister: LogPersisterFunc = (logEntries: LogEntry[]) => {
    if (!ref) {
      return Promise.reject(`No Firebase DB ref availale`);
    }

    const logEntriesWithTracking = addTrackingToItems(logEntries, appId, sessionId);
    const promises = [];

    logEntriesWithTracking.forEach(logEntry => {
      const promise = ref
        .child(path)
        .push(logEntry);

      promises.push(promise);
    });

    return Promise.all(promises);
  };

  return {
    logPersister,
    logRetreaver
  } as Transport;
};

export default createTransport;
