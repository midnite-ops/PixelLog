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

// --- Main Script ---
try {
    var retouchArray = ['Brush Tool', 'Mixer Brush', 'Layer Via Copy', 'Stamp Visible', 'Clone Stamp'];
    var historyArray = app.activeDocument.historyStates;
    var retouched = {};

    // 1️⃣ Collect all retouch actions in this session
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

    // 2️⃣ Setup PixelLog file
    var logFile = new File('~/Desktop/pixelLog.json');
    var logs = [];

    // 3️⃣ Read old logs (if file exists)
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

    // 4️⃣ Check if this file already exists in logs
    var existingIndex = -1;
    for (var i = 0; i < logs.length; i++) {
        if (logs[i].filePath === app.activeDocument.fullName.toString()) {
            existingIndex = i;
            break;
        }
    }

    // 5️⃣ Create a new log entry for this session
    var newEntry = {
        fileName: app.activeDocument.name,
        filePath: app.activeDocument.fullName.toString(),
        fileType: app.activeDocument.name.split('.').pop().toLowerCase(),
        date: new Date().toString(),
        history: retouched
    };

    // 6️⃣ If file already logged before → treat as reopen
    if (existingIndex !== -1) {
        if (!logs[existingIndex].reopens) logs[existingIndex].reopens = [];
        logs[existingIndex].reopens.push({
            date: new Date().toString(),
            sessionHistory: retouched
        });
    } else {
        logs.push(newEntry);
    }

    // 7️⃣ Save logs back to disk (formatted)
    logFile.open('w');
    logFile.write(toJSON(logs));
    logFile.close();

    alert("PixelLog updated ✅");

} catch (e) {
    alert("PixelLog Error: " + e.message);
}
