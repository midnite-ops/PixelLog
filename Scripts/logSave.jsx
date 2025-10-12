/**
 * logSave.jsx
 * This script appends a line to a log file every time it runs.
 */
function logObject(obj){
    var objectArray = [];
    for(var key in obj){
        objectArray.push(key + ': ' + obj[key]);
    }
    return objectArray.join('\n');
}

var retouchArray = ['Brush Tool', 'Mixer Brush', 'Layer Via Copy', 'Stamp Visible', 'Clone Stamp']
var historyArray = app.activeDocument.historyStates

var retouched = {}
for(var i = 0; i < historyArray.length; i++){
    var historyName = historyArray[i].name;
    var cleanName = historyName.replace(/^\s+|\s+$/g, '');
    
    // Manual indexOf check
    var found = false;
    for(var j = 0; j < retouchArray.length; j++){
        if(retouchArray[j] === cleanName){
            found = true;
            break;
        }
    }
    
    if(found){
        if(retouched[cleanName]){
            retouched[cleanName]++;
        }else{
            retouched[cleanName] = 1;
        }
    }
  
}


try{
    var logFile = new File('~/Desktop/pixelLog.json');
    var pixelLog = {
        fileName: app.activeDocument.name,
        filePath: app.activeDocument.fullName,
        fileType: app.activeDocument.name.split('.').pop().toLowerCase(),
        date: new Date().toISOString(),
        history: logObject(retouched)
    }
   
    logFile.open('a')
    logFile.writeln(logObject(pixelLog));
    logFile.close()
   
}catch(e){
    alert('The script is invalid')
}

