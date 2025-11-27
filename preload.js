const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    off: (channel, func) => ipcRenderer.off(channel, func),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    send: (channel, data) => ipcRenderer.send(channel, data)
  }
});
