/**
 * PixelLog — Tracks Photoshop file edits, saves, and reopens
 * Works in ExtendScript (older Photoshop)
 */

// --- JSON Polyfill (because JSON isn't built-in) ---
function toJSON(obj, indent) {
    if (indent === undefined) indent = 0;
    var spacing = "    "; // 4 spaces
    var pad = new Array(indent + 1).join(spacing);

    if (obj === null) return "null";
    if (typeof obj === "string") return '"' + obj.replace(/"/g, '\\"') + '"';
    if (typeof obj === "number" || typeof obj === "boolean") return obj.toString();

    if (obj instanceof Array) {
        if (obj.length === 0) return "[]";
        var arr = [];
        for (var i = 0; i < obj.length; i++) {
            arr.push(pad + spacing + toJSON(obj[i], indent + 1));
        }
        return "[\n" + arr.join(",\n") + "\n" + pad + "]";
    }

    if (typeof obj === "object") {
        var props = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var value = toJSON(obj[key], indent + 1);
                props.push(pad + spacing + '"' + key + '": ' + value);
            }
        }
        return "{\n" + props.join(",\n") + "\n" + pad + "}";
    }

    return '""';
}

//modifyObject takes three parameters: source which is the object, olditem which is the value in a the object key you want to replace and newItem is the new value in the object key 
function modifyObject(source, oldItem, newItem){
    var target = {}
    for(var key in source){
        if(source.hasOwnProperty(key)){
            if(source[key] === oldItem){
                target[key] = newItem
            }else{
                target[key] = source[key]
            }
            
        }
    }
    return target
}

// Check if this file already exists in logs
function FindFileIndex(arr){
    var existingIndex = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].filePath === app.activeDocument.fullName.toString()) {
            existingIndex = i;
            break;
        }
    }
    return existingIndex
}

function saveToDisk(logsData){
    // Save logs back to disk (formatted)
    logFile.open('w');
    logFile.write(toJSON(logsData));
    logFile.close();
}

// --- Main Script ---
try {
     // Setup PixelLog file

     // This line creates a new file in the specified directory
    var systemHome = Folder('~')
    var logFile = new File(systemHome + '/Documents/pixelLog.json');
    var logs = [];
    

    // Read old logs (if file exists)
    if (logFile.exists) {
        logFile.open('r');
        var content = logFile.read();
        logFile.close();

        try {
            if (content && content[0] === "[") eval("logs = " + content);
            else if (content && content[0] === "{") eval("logs = [" + content + "]");
        } catch (err) {
            logs = [];
        }
    }
    var fileIndex = FindFileIndex(logs)
    // --- Detect Photoshop event type safely ---
    // Photoshop notifiers pass different kinds of arguments depending on the event.
    // Sometimes it's just the numeric event ID (e.g., 'save', 'Opn ').
    // Other times, Photoshop passes an ActionDescriptor as the first argument,
    // and the actual event ID comes as the second argument.
    //
    // This block checks both cases safely before calling typeIDToCharID().
    // If neither condition matches, we fall back to 'unknown' to prevent errors.
    var eventType = 'unknown';

    //arguments is a built-in array like object, it contains everything passes into this script when a notifer is triggered
    if (arguments && arguments.length > 0) {
        var arg = arguments[0];

        // Case 1: Photoshop passed only a numeric event ID
        if (typeof arg === 'number') {
            try {
                eventType = typeIDToCharID(arg);
            } catch (e) {
                eventType = 'unknown'; // Fallback if conversion fails
            }
        }
        // Case 2: Photoshop passed an ActionDescriptor first,
        // and the numeric event ID is in the second argument
        else if (arg instanceof ActionDescriptor && arguments.length > 1 && typeof arguments[1] === 'number') {
            try {
                eventType = typeIDToCharID(arguments[1]);
            } catch (e) {
                eventType = 'unknown';
            }
        }
    }


    var retouchArray = ['Brush Tool', 'Mixer Brush', 'Layer Via Copy', 'Stamp Visible', 'Clone Stamp'];
    var historyArray = app.activeDocument.historyStates;
    var retouched = {};

    // Collect all retouch actions in this session
    for (var i = 0; i < historyArray.length; i++) {
        var historyName = historyArray[i].name.replace(/^\s+|\s+$/g, ''); // trim whitespace

        // check if history name matches one of our tools
        var found = false;
        for (var j = 0; j < retouchArray.length; j++) {
            if (retouchArray[j] === historyName) {
                found = true;
                break;
            }
        }

        if (found) {
            if (retouched[historyName]) retouched[historyName]++;
            else retouched[historyName] = 1;
        }
    }

    var newEvent = {type: eventType, date: new Date().toString(), history: retouched, fileType: app.activeDocument.name.split('.').pop().toLowerCase(),};

    //  If file already logged before 
    if (fileIndex >= 0) {
        //Pushes in a new entry to the newEntry.event array if eventType is Opn
        if(eventType === 'Opn '){
            logs[fileIndex].event.push({type: 'reopened', date: new Date().toString()})
            saveToDisk(logs);
          
        }
        else if (eventType === 'save') {
            logs[fileIndex].event.push(newEvent);
            saveToDisk(logs);
           
        }
        else if(eventType === 'Expr'){
            logs[fileIndex].event.push(modifyObject(newEvent, 'Expr', 'Export'));
            saveToDisk(logs);
        }
        else if(eventType === 'Prnt'){

            logs[fileIndex].event.push(modifyObject(newEvent, 'Prnt', 'print'));
            saveToDisk(logs);
        }
        
    } else {
        logs.push({
            fileName: app.activeDocument.name,
            filePath: app.activeDocument.fullName.toString(),
            event: [newEvent]
        });
        saveToDisk(logs);
        
    }

    

} catch (e) {
    alert("PixelLog Error: " + e.message);
}