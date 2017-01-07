import firebase from 'firebase';
import { addTrackingToItems } from './common';
import { LogEntry, LogRetreaverFunc } from '../types';

interface FirebaseTransportConfig {
    dbRef: firebase.database.Reference,
    path: string,
    appId: string,
    sessionId: string
}

const createTransport = (opts) => {
  const {
    dbRef,
    path,
    appId,
    sessionId
  } = opts;
  
  const logRetreaver: LogRetreaverFunc = () => {
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
      });
  };

  const logPersister = (logQueue) => {
    if (!dbRef) {
      return Promise.reject(`No Firebase DB ref availale`);
    }

    const logQueueWithTracking = addTrackingToItems(logQueue, appId, sessionId);

    return dbRef
      .child(path)
      .push(logQueueWithTracking)
      .then();
  };
}

export default createTransport;
  