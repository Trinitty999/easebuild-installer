const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
var fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

console.log("test")

const createWindow = () => {
	// Create the browser window.
	const win = new BrowserWindow({
	  webPreferences: {
		  preload: path.join(__dirname, 'preload.js')
	  },
	  width: 1000,
	  height: 562,
	  maximizable: false,
	  resizable: false,
	  frame: false
	});

	win.setMenu(null);

	// and load the index.html of the app.
	win.loadFile(path.join(__dirname, 'index.html'));
	win.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
	  app.quit();
	}
});

ipcMain.on("install", (e, arg) => {
	fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
		if (err) throw err;
		console.log('Saved!');
	})
	e.reply("installed")
})

ipcMain.on("repair", (e, arg) => {
	
	e.reply("installed")
})