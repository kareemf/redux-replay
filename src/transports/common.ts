export const addTrackingToItems = (logQueue, appId, sessionId) => 
  logQueue.map(entry => ({
      ...entry,
      appId,
      sessionId,
    }));
