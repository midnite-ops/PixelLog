import { LogType } from "./types/logType.js";

export const compareChanges = (
  previousLogs: LogType[],
  newLogs: LogType[],
): LogType[] | null => {
  const changedLogs = newLogs.filter((log) => {
    const previousLog = previousLogs.find(
      (prevLog) => prevLog.documentId === log.documentId,
    );

    // Completely new object
    if (!previousLog) {
      return true;
    }

    // Existing object received a new event
    if (log.event.length > previousLog.event.length) {
      return true;
    }

    return false;
  });

  return changedLogs;
};
