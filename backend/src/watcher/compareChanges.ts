import { LogType } from "../types/logType";

export const compareChanges = (
  previousLogs: LogType[],
  newLogs: LogType[]
): LogType | null => {

  // A new log was added
  if (previousLogs.length < newLogs.length) {
    return newLogs[newLogs.length - 1];
  }

  // Check whether an existing log received a new event
  for (let i = 0; i < newLogs.length; i++) {

    const previousLog = previousLogs[i];
    const newLog = newLogs[i];

    // Make sure the log exists in both versions
    if (!previousLog || !newLog) {
      continue;
    }

    // A new event was added
    if (previousLog.event.length < newLog.event.length) {
      return newLog;
    }
  }

  // Nothing changed
  return null;
};