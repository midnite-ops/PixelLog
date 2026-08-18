import { LogType } from "../types/logType";

export const compareChanges = (previousLogs: LogType[], newLogs: LogType[]) => {
  let result: LogType = {
    fileName: "",
    filePath: "",
    event: [
      {
        id: '',
        type: "",
        date: "",
        history: {},
        fileType: "",
        previewPath: "",
      },
    ],
  };

  previousLogs.forEach((logs, i) => {
    if (logs.event.length < newLogs[i].event.length) {
      result = newLogs[newLogs.length - 1];
    }
  });

  return result;
};
