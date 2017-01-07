import { database } from 'firebase';
import { addTrackingToItems } from './common';
import { LogEntry, LogRetreaverFunc, LogPersisterFunc, TransportConfig } from '../types';

interface FirebaseTransportConfig extends TransportConfig {
    dbRef: database.Reference,
    path: string,
}

const createTransport = (opts: FirebaseTransportConfig) => {
  const {
    dbRef,
    path,
    appId,
    sessionId
  } = opts;
  
  const logRetreaver: LogPersisterFunc = () => {
    if (!dbRef) {
      return Promise.reject(`No Firebase DB ref availale`);
    }

    return dbRef
      .once('value')
      .then((snapshot) => {
        // console.log('snapshot', snapshot);
        // window.snapshot = snapshot;
        const val = snapshot.val();

        // each `push` transaction has its own key - flatten into a single array
        const logEntries: LogEntry[] = Object
          .values(val[path])
          .reduce((ouput, entries) => ([...ouput, ...entries]), []);

        return logEntries;
      }) as Promise<LogEntry[]>;
  };

  const logPersister: LogPersisterFunc = (logEntries: LogEntry[]) => {
    if (!dbRef) {
      return Promise.reject(`No Firebase DB ref availale`);
    }

    const logEntriesWithTracking = addTrackingToItems(logEntries, appId, sessionId);

    return dbRef
      .child(path)
      .push(logEntriesWithTracking)
      .then();
  };
}

export default createTransport;
  