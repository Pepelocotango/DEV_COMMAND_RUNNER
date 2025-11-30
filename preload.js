const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  openTerminal: (cwd) => ipcRenderer.invoke('open-terminal', cwd),
  getConfigs: () => ipcRenderer.invoke('get-configs'),
  getConfigPath: () => ipcRenderer.invoke('get-config-path'),
  saveConfig: (payload) => ipcRenderer.invoke('save-config', payload),
  loadConfig: (name) => ipcRenderer.invoke('load-config', name),
  deleteConfig: (name) => ipcRenderer.invoke('delete-config', name),
});
