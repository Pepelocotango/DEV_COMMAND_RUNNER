const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn, execFile } = require('child_process');
const path = require('path');
const isDev = require('electron-is-dev');

// Definim un nom de classe únic. Això NO és el títol, és l'ID intern de la finestra.
const TERMINAL_CLASS_NAME = "dev-runner-unique-id";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'build/index.html')}`;

  mainWindow.loadURL(startUrl);
  
  if (isDev) mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- IPC HANDLERS ---

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('open-terminal', async (event, cwd) => {
  if (!cwd) return { success: false, msg: "No hi ha directori seleccionat" };

  try {
    // ESTRATÈGIA CORREGIDA:
    // 1. --disable-factory: Crea una instància nova i independent.
    // 2. --name: Assigna el 'classname' (WM_CLASS) que xdotool sí que pot buscar.
    //    Nota: El bash canviarà el títol, però no pot canviar el 'name'.
    const terminal = spawn('mate-terminal', [
      '--working-directory', cwd,
      '--disable-factory', 
      '--name', TERMINAL_CLASS_NAME
    ], {
      detached: true,
      stdio: 'ignore'
    });
    
    terminal.unref();
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, msg: e.message };
  }
});

ipcMain.handle('send-text-to-terminal', async (event, text) => {
  return new Promise((resolve, reject) => {
    // CORRECCIÓ: Usem '--classname' en lloc de '--role'.
    // Això coincidirà amb el paràmetre '--name' que hem usat al spawn.
    const args = [
      'search', '--classname', TERMINAL_CLASS_NAME, 
      'windowactivate', '--sync', 
      'type', '--clearmodifiers', '--delay', '10', 
      text + " "
    ];

    execFile('xdotool', args, (error, stdout, stderr) => {
      if (error) {
        console.error("Error xdotool:", stderr);
        resolve({ success: false, msg: "No trobo la terminal. Tanca-la i torna a obrir-la des del botó gran." });
      } else {
        resolve({ success: true });
      }
    });
  });
});