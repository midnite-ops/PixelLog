/*
PixelLog Event Flow

1. Photoshop triggers a notifier event
2. Determine which event occurred (save, export, print, open)
3. Collect document information
4. Analyze Photoshop history states
5. Generate a JPEG preview
6. Append event data to pixelLog.json
7. Save updated logs to disk

The JSON file acts as the source of truth for the PixelLog dashboard.
*/

// --- JSON Polyfill (because JSON isn't built-in) ---
function toJSON(obj, indent) {
  if (indent === undefined) indent = 0;
  var spacing = "    "; // 4 spaces
  var pad = new Array(indent + 1).join(spacing);

  if (obj === null) return "null";
  if (typeof obj === "string") return '"' + obj.replace(/"/g, '\\"') + '"';
  if (typeof obj === "number" || typeof obj === "boolean")
    return obj.toString();

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

//This creates a an id similar to crypto.randomUUID()
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

var eventId = generateUUID();

var PIXELOG_NAMESPACE = "http://pixellog.com/ns/1.0/"

function savePreview() {
  // Creates a temporary copy of the active document so PixelLog can generate previews
  // without modifying the user's original PSD
  var duplicateDoc = app.activeDocument.duplicate();

  // Merges all layers into a single layer.
  // Useful because JPEG exports don't preserve Photoshop layers.
  duplicateDoc.flatten();

  if (ExternalObject.AdobeXMPScript === undefined) {
    ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
  }

  XMPMeta.registerNamespace(PIXELOG_NAMESPACE, "pl");

  var xmp = new XMPMeta(duplicateDoc.xmpMetadata.rawData);

  xmp.setProperty("http://pixellog.com/ns/1.0/", "eventId", eventId);

  duplicateDoc.xmpMetadata.rawData = xmp.serialize();

  var previewFolder = new Folder(
    Folder("~").fsName + "/Documents/PixelLog/previews",
  );

  if (!previewFolder.exists) {
    previewFolder.create();
  }
  // Reference to the document currently open and selected in Photoshop which is: app.activeDocument
  var fileName = app.activeDocument.name;

  var jpegFile = new File(previewFolder + "/" + fileName);

  var jpegOptions = new JPEGSaveOptions();
  jpegOptions.quality = 8;

  // Saves the duplicate document as a JPEG preview.
  // Third argument (true) tells Photoshop to save a copy instead of replacing the active document.
  duplicateDoc.saveAs(jpegFile, jpegOptions, true);

  // Closes the temporary duplicate without saving changes.
  // Prevents the preview-generation process from affecting the original document.
  duplicateDoc.close(SaveOptions.DONOTSAVECHANGES);

  return jpegFile.fsName;
}

//This function takes a parameter which returns the name and contents of the active file and the file path if it exists

function getDocumentInfo(doc) {
  var info = {
    name: doc.name,
    isSaved: false,
    path: null,
    history: doc.historyStates,
  };

  try {
    info.path = doc.fullName.toString();
    info.isSaved = true;
  } catch (e) {
    info.path = null;
    info.isSaved = false;
  }

  return info;
}

// Check if this file already exists in logs
function FindFileIndex(arr) {
  var existingIndex = -1;
  for (var i = 0; i < arr.length; i++) {
    if (docInfo.path && arr[i].filePath === docInfo.path) {
      existingIndex = i;
      break;
    }
  }
  return existingIndex;
}

function saveToDisk(logsData) {
  // Save logs back to disk (formatted)
  logFile.open("w");
  logFile.write(toJSON(logsData));
  logFile.close();
}

function changeEventName(event) {
  const newName = "";
  if (event === "Expr") {
    newName = "Export";
  } else if (event === "Prnt") {
    newName = "Print";
  } else {
    return;
  }
  return newName;
}

var docInfo = getDocumentInfo(app.activeDocument);

// --- Main Script ---
try {
  // Setup PixelLog file
  // User's home directory.
  // macOS example: /Users/mac
  // Windows example: C:/Users/Jesse
  // new Folder creates a
  var pixelLogFolder = new Folder(Folder("~").fsName + "/Documents/PixelLog");

  if (!pixelLogFolder.exists) {
    pixelLogFolder.create();
  }
  var logFile = new File(pixelLogFolder + "/pixelLog.json");
  var logs = [];

  // Read old logs (if file exists)
  if (logFile.exists) {
    logFile.open("r");
    var content = logFile.read();
    logFile.close();

    try {
      if (content && content[0] === "[") eval("logs = " + content);
      else if (content && content[0] === "{") eval("logs = [" + content + "]");
    } catch (err) {
      logs = [];
    }
  }
  var fileIndex = FindFileIndex(logs);

  // --- Detect Photoshop event type safely ---
  // Photoshop notifiers pass different kinds of arguments depending on the event.
  // Sometimes it's just the numeric event ID (e.g., 'save', 'Opn ').
  // Other times, Photoshop passes an ActionDescriptor as the first argument,
  // and the actual event ID comes as the second argument.
  //
  // This block checks both cases safely before calling typeIDToCharID().
  // If neither condition matches, we fall back to 'unknown' to prevent errors.
  var eventType = "unknown";

  //arguments is a built-in array like object, it contains everything passes into this script when a notifer is triggered

  if (arguments && arguments.length > 0) {
    var arg = arguments[0];

    // Case 1: Photoshop passed only a numeric event ID
    if (typeof arg === "number") {
      try {
        eventType = typeIDToCharID(arg);
      } catch (e) {
        eventType = "unknown"; // Fallback if conversion fails
      }
    }
    // Case 2: Photoshop passed an ActionDescriptor first,
    // and the numeric event ID is in the second argument
    else if (
      arg instanceof ActionDescriptor &&
      arguments.length > 1 &&
      typeof arguments[1] === "number"
    ) {
      try {
        eventType = typeIDToCharID(arguments[1]);
      } catch (e) {
        eventType = "unknown";
      }
    }
  }

  var retouchArray = [
    "Brush Tool",
    "Mixer Brush",
    "Layer Via Copy",
    "Stamp Visible",
    "Clone Stamp",
  ];
  // Array containing all history entries currently visible in Photoshop's History panel.
  // These entries only exist during the current Photoshop session.
  var historyArray = docInfo.history;
  var retouched = {};

  // Collect all retouch actions in this session
  for (var i = 0; i < historyArray.length; i++) {
    var historyName = historyArray[i].name.replace(/^\s+|\s+$/g, ""); // trim whitespace

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

  var newEvent = {
    id: eventId,
    type: changeEventName(eventType) || eventType,
    date: new Date().toString(),
    history: retouched,
    fileType: docInfo.name.split(".").pop().toLowerCase(),
    previewPath: savePreview(),
  };

  //  If file already logged before
  if (fileIndex >= 0) {
    //Pushes in a new entry to the newEntry.event array if eventType is Opn
    if (eventType === "Opn ") {
      logs[fileIndex].event.push({
        type: "reopened",
        date: new Date().toString(),
      });
      saveToDisk(logs);
    } else if (eventType === "save") {
      logs[fileIndex].event.push(newEvent);
      saveToDisk(logs);
    } else if (eventType === "Expr") {
      logs[fileIndex].event.push(newEvent);
      saveToDisk(logs);
    } else if (eventType === "Prnt") {
      logs[fileIndex].event.push(newEvent);
      saveToDisk(logs);
    }
  } else {
    logs.push({
      fileName: docInfo.name,
      filePath: docInfo.path,
      event: [newEvent],
    });
    saveToDisk(logs);
  }
} catch (error) {
  alert("PixelLog Error: " + error.message + eventType);
}
