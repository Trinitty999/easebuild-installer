const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
var fs = require('fs');
var hashes = require('jshashes');
var installed = fs.existsSync("C:\\Progran Files\\test")
console.log(installed)

var exec = require('child_process').exec; 
exec('NET SESSION', function(err,so,se) {
      console.log(se.length === 0 ? "admin" : "not admin");
    });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

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
	
	if(!exec){
		win.loadFile(path.join(__dirname, 'notadmin.html'));
	}
	else{
		win.loadFile(path.join(__dirname, 'index.html'));
	}

	win.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
	  app.quit();
	}
});

ipcMain.on("install", (e, arg) => {
	fs.mkdirSync("C:\\Program Files\\test")
	fs.writeFileSync('C:\\Program Files\\test\\testfile.txt', 'Hello world!', function (err) {
		if (err) throw err;
		console.log('Installed successfully');
	})
	console.log("Installed")
	installed = true;
	e.reply("installed")
})

ipcMain.on("repair", (e, arg) => {
	if (installed){
		fs.unlinkSync("C:\\Program Files\\test\\testfile.txt", (err) => {
			if (err) {
			  console.error(`Error: ${err}`);
			} else {
			  console.log('File was deleted succcessfully');
			}
		});
		fs.rmdirSync("C:\\Program Files\\test")
		fs.mkdirSync("C:\\Program Files\\test")
		fs.writeFileSync('C:\\Program Files\\test\\testfile.txt', 'Hello repaired world!', function (err) {
			if (err) throw err;
			console.log('Reinstalled successfully');
		})
		console.log("Repaired")
		e.reply("repaired")
	}
	else {
		e.reply("not-installed")
	}
	
})

ipcMain.on("uninstall", (e, arg) => {
	fs.unlinkSync("C:\\Program Files\\test\\testfile.txt", (err) => {
		if (err) {
		  console.error(`Error: ${err}`);
		} else {
		  console.log('File was deleted succcessfully');
		}
	  });
	  fs.rmdirSync("C:\\Program Files\\test")
	  console.log("Uninstalled")
	e.reply("uninstalled")
})

ipcMain.on("quit", () => {
	app.quit()
})