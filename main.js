console.log("Hello from Electron!")
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const { spawn } = require('child_process');
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