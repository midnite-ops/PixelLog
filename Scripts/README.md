PixelLog – Photoshop Logging Scripts

PixelLog is an experimental Photoshop plugin built with ExtendScript.
It tracks file save events and logs them into a text file, helping photo studios monitor edits.

📂 What’s Inside

saveEvent.jsx → sets up the Photoshop notifier for file saves

logSave.jsx → logs saved files into PixelLog.txt on your Desktop

⚡ Installation
OPTION 1 – Run Locally

Download the Scripts folder:
Download PixelLog Scripts

Unzip the folder.

Open Photoshop.

Go to File → Scripts → Browse...

Select and run saveEvent.jsx.

OPTION 2 – Install into Photoshop Scripts Folder

Copy the .jsx files into Photoshop’s scripts directory:

Windows:

C:\Program Files\Adobe\Adobe Photoshop <version>\Presets\Scripts


macOS:

/Applications/Adobe Photoshop <version>/Presets/Scripts


Restart Photoshop.

You’ll now find PixelLog scripts under File → Scripts.

📝 How It Works

When you run saveEvent.jsx, PixelLog sets up a notifier for the Save event.

Each time you save a Photoshop document, logSave.jsx will:

Create or update PixelLog.txt on your Desktop.

Record the file name and timestamp of the save.

❌ Removing PixelLog

Run the following snippet in the ExtendScript Toolkit or a .jsx file:

for (var i = app.notifiers.length - 1; i >= 0; i--) {
    if (app.notifiers[i].event == "save") {
        app.notifiers[i].remove();
    }
}


This removes the PixelLog save notifier.


✨ Built in public by PixelLog.