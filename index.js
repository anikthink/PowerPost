const electron = require('electron');

const { app, BrowserWindow } = electron;

app.on('ready', () => {
    const mainWindow = new BrowserWindow({});
    mainWindow.loadFile('shape.html');
});