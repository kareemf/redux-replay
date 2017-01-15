import uuid from 'uuid';
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import createReplayer, { createFirebaseTransport } from '../../../lib';

import Counter from './components/Counter';
import counter from './reducers';
import authenticateWithFirebase from './authenticateWithFirebase';

const LOGGING_APP_ID = `firebase-counter`;
const LOGGING_SESSION_ID = uuid.v4();

const firebaseConfig = require('../firebaseConfig.json');

authenticateWithFirebase(firebaseConfig).then(({ ref, path }) => {
  const { logPersister, logRetreaver } = createFirebaseTransport({
    ref,
    path,
    appId: LOGGING_APP_ID,
    sessionId: LOGGING_SESSION_ID,
  });

  const logger = createLogger({
    // persist all actions except replayed ones
    // `__replayed` is added to replayed actions by `createReplayer`'s default `actionTransformer`
    persistencePredicate: (getState, action) => !action.__replayed,
    persister: logPersister,
  });

  const rootReducer = (state, action) => {
    if (action.type === `RESET_STATE`) {
      return counter(undefined, action);
    }

    return counter(state, action);
  };

  const store = compose(
    applyMiddleware(logger)
  )(createStore)(rootReducer);

  const rootEl = document.getElementById('root')

  const render = () => {
    ReactDOM.render(
      <Counter
        value={store.getState()}
        onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
        onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
      />,
      rootEl
    );
  };

  const stateResetAction = { type: `RESET_STATE` };
  const replaySession = createReplayer({
    store,
    render,
    stateResetAction,
    logRetreaver,
  });

  window.actionReplay = {
    fetchSession: logRetreaver,
    sessionId: LOGGING_SESSION_ID,
    replaySession,
  };

  store.subscribe(render);

  render();
});
