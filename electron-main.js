const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'public', 'electron.js'), // adjust path if needed
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  // Point this to your Vite dev server or build output:
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    win.loadURL('http://localhost:5173'); // Or your Vite dev URL
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// ==== PERSISTENT SAVE/LOAD IPC HANDLERS ====

const CHAR_DIR = path.join(__dirname, 'src', 'data', 'SaveData', 'character');

ipcMain.handle('save-character', async (event, character) => {
  if (!fs.existsSync(CHAR_DIR)) fs.mkdirSync(CHAR_DIR, { recursive: true });
  const file = path.join(CHAR_DIR, `${character.id}.json`);
  fs.writeFileSync(file, JSON.stringify(character, null, 2));
  return true;
});

ipcMain.handle('load-character', async (event, id) => {
  const file = path.join(CHAR_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
});

ipcMain.handle('load-all-characters', async () => {
  if (!fs.existsSync(CHAR_DIR)) return [];
  return fs.readdirSync(CHAR_DIR)
    .filter(fn => fn.endsWith('.json'))
    .map(fn => JSON.parse(fs.readFileSync(path.join(CHAR_DIR, fn), 'utf-8')));
});
