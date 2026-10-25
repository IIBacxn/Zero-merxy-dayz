const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 960, minWidth: 1024, minHeight: 700,
    title: 'DayZ Standalone Loadout Builder',
    backgroundColor: '#0a100d',
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  if (!app.isPackaged) win.loadURL('http://127.0.0.1:5173');
  else win.loadURL(pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href);
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });