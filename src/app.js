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

var logdir = tempdir+"\\InstallerLogs"

//*Here it generates a filename by Base64-ing the current date and time.

var logfilename = btoa(Date())

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
	//*Here it checks if the user is admin or not.

	admin.check().then(result => {
		if (result){
			win.loadFile(path.join(__dirname, "index.html"))
			inform("User is an admin");
		}
		else{
			win.loadFile(path.join(__dirname, "notadmin.html"))
			logerr("User is not an admin");
		}
		
	})
	//* Telling the backend to minimize the window when the signal "minimize" is received.

	ipcMain.on("toggle-devtools", (e, arg) => {
		inform("Dev code received! Opening devtools.")
		win.webContents.openDevTools({
			mode: 'detach'
		});	
	})

	ipcMain.on("minimize", () => {
		
		
		inform("Minimizing window")
		win.minimize()
	})
	
};

app.on('ready', createWindow);

inform("Window created.")



app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
	  app.quit();
	}
});


//*Creating all the necessary hooks for installing, repairing and uninstalling



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

//* Telling the backend to clean up the logs and to end the render process when the signal "quit" is received.

ipcMain.on("quit", () => {
	warning("Quitting.")
	fs.rm(logdir, { recursive: true, force: true }, (err) => {
		if (err) {
		  throw err;
		  logerr("Log files are not deleted!")
		}
		inform('Log files deleted!');
	  });
	app.quit()
})

