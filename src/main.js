const electron = require('electron');
const { app, BrowserWindow, ipcMain: ipc } = electron;
const images = require('./images')
let mainWindow;
app.on('ready', _ => {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 725,
        resizeable: false
    });


    mainWindow.loadURL(`file://${__dirname}/capture.html`)

    mainWindow.webContents.openDevTools();

    images.mkDir(images.getPicturesPath(app))

    mainWindow.on('closed', _ => mainWindow = null)

});

ipc.on('image-captured', (evt, contents) => {
    const imgPath = images.getPicturesPath(app);
    images.save(imgPath, contents, (err, imgPath) => {
        images.cache(imgPath);
    });
});

ipc.on('image-remove', (evt, index) => {
    images.rm(index, _ => {
        evt.sender.send('image-removed', index);
    })
});