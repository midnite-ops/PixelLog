/* This file records the save event in photoshop and runs eventFile */

var eventFile = new File ('~/Desktop/Scripting/logSave.jsx');
app.notifiersEnabled = true
for(var i = app.notifiers.length - 1; i >= 0; i--){
    if(app.notifiers[i].event == 'save'){
        app.notifiers[i].remove();
    }
}
var saved = app.notifiers.add('save', eventFile)
alert(eventFile.exists)

