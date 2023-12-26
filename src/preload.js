const { contextBridge, ipcRenderer } = require('electron')

// Expose a global API to the renderer process
contextBridge.exposeInMainWorld('ipcAPI', {
  // A function to send a message to the main process
  send: (channel, data) => {
    ipcRenderer.send(channel, data)
  },
  // A function to receive a message from the main process
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args))
  }
})
