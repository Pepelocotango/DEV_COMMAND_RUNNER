const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  // Detectar mode desenvolupament sense dependències externes
  const isDev = !app.isPackaged;

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
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
    if (process.platform === 'win32') {
      // Windows: PowerShell
      spawn('powershell.exe', [], {
        cwd: cwd,
        detached: true,
        stdio: 'ignore',
        shell: true
      }).unref();
    } else if (process.platform === 'darwin') {
      // macOS: Terminal.app
      spawn('open', ['-a', 'Terminal', cwd], {
        detached: true,
        stdio: 'ignore'
      }).unref();
    } else {
      // Linux: múltiples terminals amb fallback
      const terminals = [
        'x-terminal-emulator',
        'gnome-terminal',
        'konsole',
        'xfce4-terminal',
        'mate-terminal',
        'xterm'
      ];

      let terminalOpened = false;
      for (const terminal of terminals) {
        try {
          spawn(terminal, ['--working-directory', cwd], {
            detached: true,
            stdio: 'ignore'
          }).unref();
          terminalOpened = true;
          break;
        } catch (e) {
          continue;
        }
      }

      if (!terminalOpened) {
        return { success: false, msg: "No s'ha pogut obrir cap terminal" };
      }
    }

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, msg: e.message };
  }
});

// --- CONFIG MANAGER IPC ---
const configDir = path.join(app.getPath('userData'), 'configs');

// Ensure config directory exists
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

ipcMain.handle('get-configs', async () => {
  try {
    const files = fs.readdirSync(configDir);
    return files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
  } catch (e) {
    console.error("Error reading configs:", e);
    return [];
  }
});

ipcMain.handle('save-config', async (event, { name, data }) => {
  try {
    const filePath = path.join(configDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (e) {
    console.error("Error saving config:", e);
    return { success: false, error: e.message };
  }
});

ipcMain.handle('load-config', async (event, name) => {
  try {
    const filePath = path.join(configDir, `${name}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (e) {
    console.error("Error loading config:", e);
    return null;
  }
});

ipcMain.handle('delete-config', async (event, name) => {
  try {
    const filePath = path.join(configDir, `${name}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false, error: "File not found" };
  } catch (e) {
    console.error("Error deleting config:", e);
    return { success: false, error: e.message };
  }
});