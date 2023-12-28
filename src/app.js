//*All necessary imports are performed here.
var log4js = require("log4js")
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
var fs = require('fs');
var hashes = require('jshashes');
const { info, error } = require("console");
const admin = require("admin-check")

var tempdir = process.env.LOCALAPPDATA + "\\Temp"

try{
	fs.mkdirSync(tempdir+"\\InstallerLogs")
}
catch{
	console.warn("Directory already exists.")
}
var devmode = false;

var logdir = tempdir+"\\InstallerLogs"

//*Here it generates a filename by Base64-ing the current date and time.

var logfilename = btoa(Date())

console.log(Date())

console.log(logfilename)

//*Then it configures the logger.

log4js.configure({
	appenders: {
		out: { type: "stdout" },
		app: { type: "file", filename: logdir+"\\installer-"+logfilename+".log"}
	},
	categories: {
		default: { appenders: ["out"], level: "info" },
		app: { appenders: ["app"], level: "info"},
	},
});

//*Here it creates the loggers.
var logger = log4js.getLogger()
var logtofile = log4js.getLogger("app")

function inform(value){
	logger.info(value)
	logtofile.info(value)
}

function logerr(value){
	logger.error(value)
	logtofile.error(value)
}

function warning(value){
	logger.warn(value)
	logtofile.warn(value)
}


//*Here it checks if the user is admin or not.


var isAdmin;

admin.check().then(result => {
	if (result){
		isAdmin = true;
		inform("User is an admin");
	}
	else{
		isAdmin = false;
		inform("User is not an admin");
	}
	
})

//*It checks if the program is already installed.

inform("Checking if file is already installed...")

var installed = fs.existsSync("C:\\Progran Files\\test")

if (installed){
	inform("File is already installed.")
}

inform("Application started.")

//*Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

inform("Creating window...")

//*this function creates a window.
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
	
	// if(isAdmin){
		win.loadFile(path.join(__dirname, 'index.html'));
	// }
	// else{
	// 	win.loadFile(path.join(__dirname, 'notadmin.html'));
	// }
	if (devmode){
		win.webContents.openDevTools();
	}
};

app.on('ready', createWindow);

inform("Window created.")



app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
	  app.quit();
	}
});

//*Creating all the necessary hooks for installing, repairing and uninstalling

ipcMain.on("toggle-devtools", (e, arg) => {
	inform("Dev code received! Opening devtools.")
	devtools = !devtools
	win.webContents.openDevTools
})

ipcMain.on("install", (e, arg) => {
	fs.mkdirSync("C:\\Program Files\\test")
	fs.writeFileSync('C:\\Program Files\\test\\testfile.txt', 'Hello world!', function (err) {
		if (err) throw err;
		console.log('Installed successfully');
	})
	inform("File installed")
	installed = true;
	e.reply("installed")
})

ipcMain.on("repair", (e, arg) => {
	if (installed){
		fs.unlinkSync("C:\\Program Files\\test\\testfile.txt", (err) => {
			if (err) {
			  console.error(`Error: ${err}`);
			} else {
			  inform('File was deleted succcessfully');
			}
		});
		fs.rmdirSync("C:\\Program Files\\test")
		fs.mkdirSync("C:\\Program Files\\test")
		fs.writeFileSync('C:\\Program Files\\test\\testfile.txt', 'Hello repaired world!', function (err) {
			if (err) throw err;
			inform('File reinstalled successfully');
		})
		inform("File repaired")
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
		  inform('File was deleted succcessfully');
		}
	  });
	  fs.rmdirSync("C:\\Program Files\\test")
	  inform("Uninstalled")
	e.reply("uninstalled")
})

//* Telling the backend to end the render process when the signal "quit" is received.

ipcMain.on("quit", () => {
	app.quit()
})