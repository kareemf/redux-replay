import { LogEntry } from '../types';

interface LogEntryPreprocessor {
  (logQueue: LogEntry[], appId: string, sessionId: string): LogEntry[]
}

export const addTrackingToItems: LogEntryPreprocessor = (logQueue: LogEntry[], appId: string, sessionId: string) => 
  logQueue.map(entry => ({
      ...entry,
      appId,
      sessionId,
    }));
