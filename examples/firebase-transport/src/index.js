import uuid from 'uuid';
import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import createReplayer, { createFirebaseTransport } from 'redux-replay';

import Counter from './components/Counter'
import counter from './reducers'
import setupFirebase from './setupFirebase'

// TODO: read from config
const LOGGING_APP_ID = `firebase-counter`;
const LOGGING_SESSION_ID = uuid.v4();

// TODO: read from config
const firebaseConfig = require('firebaseConfig.json')

// TODO:
// dbRef -> ref
// renderApp -> render

setupFirebase(firebaseConfig).then(({ ref, path }) => {
  const { logPersister, logRetreaver } = createFirebaseTransport({
    dbRef: ref,
    path,
    appId: LOGGING_APP_ID,
    sessionId: LOGGING_SESSION_ID,
  });

  const logger = createLogger({
    // log all actions except replayed actions
    predicate: (getState, action) => !action.__replayed,
    persister: logPersister
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

  const render = () => ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
      onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
    />,
    rootEl
  )

  const stateResetAction = { type: `RESET_STATE` };
  const replaySession = createReplayer({
    store,
    renderApp: render,
    stateResetAction,
    logRetreaver,
  });

  render()
  store.subscribe(render)
  window.replaySession = replaySession;
});
