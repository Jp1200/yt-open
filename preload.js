const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  downloadVideo: (url, options) => ipcRenderer.send('start-download', { url, options }),
});
