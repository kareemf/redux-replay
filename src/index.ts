// replaySession()
// replaySession({playbackSpeed: 2})
// replaySession({sessionId:"2513f0a8-8292-4f01-8bd4-7d678b4ebaea"})
// replaySession({sessionId:"2513f0a8-8292-4f01-8bd4-7d678b4ebaea", playbackSpeed: 2})

const createReplayer = (rootOpts) => {
  const {
    store,
    renderApp,
    stateResetAction,
    logRetreaver,
  } = rootOpts;

  const replayAction = action => {
    store.dispatch(action);
    renderApp();
  };

  const replayLogEntries = (logEntries, opts = {}, index = 0) => {
    const logEntry = logEntries[index];

    if (!logEntry) { return; }

    const nextLogEntry = logEntries[index + 1];
    const { action } = logEntry;
    const replayedAction = {
      ...action,
      __replayed: true,
    };

    // play immediately if info required to quantize is not available
    if (!nextLogEntry || !logEntry.started || !nextLogEntry.started) {
      replayAction(replayedAction);
      return;
    }

    const { playbackSpeed = 1 } = opts;
    const timeDiff = (nextLogEntry.started - logEntry.started) / playbackSpeed;

    setTimeout(() => {
      replayAction(replayedAction);
      replayLogEntries(logEntries, opts, index + 1);
    }, timeDiff);
  };

  const replaySession = (opts) => {
    const { dispatch } = store;

    logRetreaver(opts).then((logEntries) => {
        // reset store - without persisting action - before replaying fetched actions
        // TODO: allow callable stateResetAction
      dispatch({ ...stateResetAction, __replayed: true });

      replayLogEntries(logEntries, opts);
    });
  };

  return replaySession;
};

export default createReplayer;