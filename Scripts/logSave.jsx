/**
 * logSave.jsx
 * Logs Photoshop document save events with edit history and file info.
 * Keeps all logs in a single JSON array (pixelLog.json)
 * Compatible with ExtendScript (Photoshop 2022 and below)
 */

// --- JSON polyfill ---
function toJSON(obj) {
    if (obj === null) return "null";
    if (typeof obj === "string") return '"' + obj.replace(/"/g, '\\"') + '"';
    if (typeof obj === "number" || typeof obj === "boolean") return obj.toString();

    if (obj instanceof Array) {
        var arr = [];
        for (var i = 0; i < obj.length; i++) {
            arr.push(toJSON(obj[i]));
        }
        return "[" + arr.join(",") + "]";
    }

    if (typeof obj === "object") {
        var props = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                props.push('"' + key + '":' + toJSON(obj[key]));
            }
        }
        return "{" + props.join(",") + "}";
    }

    return '""';
}

// --- Main Script ---
try {
    var retouchArray = ['Brush Tool', 'Mixer Brush', 'Layer Via Copy', 'Stamp Visible', 'Clone Stamp'];
    var historyArray = app.activeDocument.historyStates;
    var retouched = {};

    for (var i = 0; i < historyArray.length; i++) {
        var historyName = historyArray[i].name;
        var cleanName = historyName.replace(/^\s+|\s+$/g, '');

        var found = false;
        for (var j = 0; j < retouchArray.length; j++) {
            if (retouchArray[j] === cleanName) {
                found = true;
                break;
            }
        }

        if (found) {
            if (retouched[cleanName]) {
                retouched[cleanName]++;
            } else {
                retouched[cleanName] = 1;
            }
        }
    }

    // Define log file
    var logFile = new File('~/Desktop/pixelLog.json');

    // --- Read existing logs ---
    var logs = [];
    if (logFile.exists) {
        logFile.open('r');
        var content = logFile.read();
        logFile.close();

        // Try parsing old content
        try {
            // crude JSON parser for ExtendScript
            if (content && content[0] === "[") {
                eval("logs = " + content);
            } else if (content && content[0] === "{") {
                eval("logs = [" + content + "]");
            }
        } catch (err) {
            logs = [];
        }
    }

    // --- Add new log entry ---
    var pixelLog = {
        fileName: app.activeDocument.name,
        filePath: app.activeDocument.fullName,
        fileType: app.activeDocument.name.split('.').pop().toLowerCase(),
        date: new Date().toString(),
        history: retouched
    };

    logs.push(pixelLog);

    // --- Save updated array ---
    logFile.open('w');
    logFile.write(toJSON(logs));
    logFile.close();

    alert("PixelLog entry saved ✅");

} catch (e) {
    alert("PixelLog Error: " + e.message);
}
