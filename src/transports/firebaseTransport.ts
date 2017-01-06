import addTrackingToItems from './common';

const createTransport = (opts) => {
  const {
    dbRef,
    childKey,
    appId,
    sessionId
  } = opts;
  
  const logRetreaver = () => {
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
        const logEntries = Object
          .values(val[childKey])
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
      .child(childKey)
      .push(logQueueWithTracking)
      .then();
  };
}

export default createTransport;
  