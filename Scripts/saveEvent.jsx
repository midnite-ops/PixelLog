/* This file records the save event in photoshop and runs eventFile */
var currentFolder = File($.fileName).parent
var eventFile = new File (currentFolder + '/logSave.jsx');
app.notifiersEnabled = true
for(var i = app.notifiers.length - 1; i >= 0; i--){
    if(app.notifiers[i].event == 'save' || app.notifiers[i].event == 'Expr'){
        app.notifiers[i].remove();
    }
}
var saved = app.notifiers.add('save', eventFile)
var exportEvent = app.notifiers.add('Expr', eventFile)


