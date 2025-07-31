console.log("Hello from Electron!")
const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
         webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    })
    win.loadFile('src/index.html')
}
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle('read-dir', async (_event, dirPath) => {
  try {
    const files = fs.readdirSync(dirPath).map(name => {
      const fullPath = path.join(dirPath, name);
      const isDirectory = fs.statSync(fullPath).isDirectory();
      return { name, path: fullPath, isDirectory };
    });
    return files;
  } catch (err) {
    return { error: err.message };
  }
});
ipcMain.on('start-download', (event, data) => {
  const { url, options } = data;

  if (!url) return;

  const args = [url];

  // Example: map options to yt-dlp flags
  options.forEach((opt, i) => {
    args.push(`--write-info-json`); // Placeholder example
  });

  const ytDlp = spawn('yt-dlp', args);

  ytDlp.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ytDlp.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ytDlp.on('close', (code) => {
    console.log(`yt-dlp exited with code ${code}`);
  });
});
app.whenReady().then(() =>{
    createWindow()
    app.on('activate', () => {
     if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// app.on('window-all-closed', ()=>{
//     if (process.platform !== 'darwin') app.quit()
// })