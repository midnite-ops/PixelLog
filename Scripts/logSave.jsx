/**
 * logSave.jsx
 * This script appends a line to a log file every time it runs.
 */

var logFile = new File("~/Desktop/pixelLog.txt");

logFile.open('a');
logFile.writeln(app.activeDocument.name + 'was saved at' + new Date())
logFile.close()
alert(app.activeDocument.name + 'was saved')


