import { Store, Action } from 'redux';

export { Store, Action }

export interface ReplayerConfig {
    store: Store<any>,
    stateResetAction: Action,
    renderApp(): any,
    logRetreaver(opts: ReplayOptions): Promise<any>;
}

export interface ReplayOptions {
  playbackSpeed?: number;
  sessionId?: string;
}

export interface LogEntry {
  action: Action,
  nextState: any,
  // started: Date, // can't use b/c of compilation error with subtraction  
  started: any,
  took?: number,
  [propName: string]: any;
}
