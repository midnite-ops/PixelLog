/**
 * logSave.jsx
 * This script appends a line to a log file every time it runs.
 */

var retouchHistory = [];

// var historyArray = app.activeDocument.historyStates;
// for(var i = 0; i < historyArray.length; i++){
//     var state = historyArray[i].name;
//     if(state === 'Brush Tool' || state === 'Mixer Brush' || state === 'Clone Stamp' || state === 'Layer Via Copy' || state === 'Patch Tool'){
//         retouchHistory.push(state);
//     }
// }
// alert(retouchHistory)
// var retouched = []
// for (var i = 0; i < retouchHistory.length; i++) {
//     var item = retouchHistory[i];
//     alert(item)
//     // If we haven't seen this item yet
//     if (retouched.indexOf(item) === -1) {
//         retouched.push(item); // Mark as seen
//         // Do something with item here
//     }
// }
// alert(retouched)

var logFile = new File("~/Desktop/pixelLog.txt");
logFile.open('a');
logFile.writeln(app.activeDocument.name + 'was saved at' + new Date())
logFile.close()
alert(app.activeDocument.name + ' was saved')


