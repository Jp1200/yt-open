const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    readDir: (path) => ipcRenderer.invoke('read-dir', path), 
    downloadVideo: (url, options) => ipcRenderer.send('start-download', { url, options }),
});
