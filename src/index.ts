import {
  ReplayerConfig,
  ReplayOptions,
  Action,
  LogEntry
} from './types';

const createReplayer = (config: ReplayerConfig) => {
  const {
    store,
    render,
    stateResetAction,
    logRetreaver,
  } = config;

  const replayAction = (action : Action) => {
    store.dispatch(action);
    render();
  };

  const replayLogEntries = (logEntries: LogEntry[], opts: ReplayOptions = {}, index = 0) => {
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

    const { playSpeed = 1 } = opts;
    const timeDiff = (nextLogEntry.started - logEntry.started) / playSpeed;

    setTimeout(() => {
      replayAction(replayedAction);
      replayLogEntries(logEntries, opts, index + 1);
    }, timeDiff);
  };

  const replaySession = (opts: ReplayOptions) => {
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
export  * from './transports';
