const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
var fs = require('fs');
var hashes = require('jshashes');
var installed = fs.existsSync("testfile.txt")
var dirpath = "C:\\Users\\"+path.sep+"\\AppData\\LocalLow"
console.log(installed)

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

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
	  app.quit();
	}
});

ipcMain.on("install", (e, arg) => {
	fs.writeFile('testfile.txt', 'Hello world!', function (err) {
		if (err) throw err;
		console.log('Installed successfully');
	})
	installed = true;
	e.reply("installed")
})

ipcMain.on("repair", (e, arg) => {
	if (installed){
		fs.unlink("testfile.txt", (err) => {
			if (err) {
			  console.error(`Error: ${err}`);
			} else {
			  console.log('File was deleted succcessfully');
			}
		});

		fs.writeFile('testfile.txt', 'Hello repaired world!', function (err) {
			if (err) throw err;
			console.log('Reinstalled successfully');
		})
		e.reply("repaired")
	}
	else {
		e.reply("not-installed")
	}
	
})

ipcMain.on("uninstall", (e, arg) => {
	fs.unlink("testfile.txt", (err) => {
		if (err) {
		  console.error(`Error: ${err}`);
		} else {
		  console.log('File was deleted succcessfully');
		}
	  });
	e.reply("uninstalled")
})

ipcMain.on("quit", () => {
	app.quit()
})