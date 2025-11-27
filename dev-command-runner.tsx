import React, { useState, useEffect } from 'react';
import { Terminal, FolderOpen, Sun, Moon, Play, Smartphone, Monitor, Settings } from 'lucide-react';

// Comandes definides
const defaultCommands = {
  categories: [
    {
      id: 'desktop-dev',
      name: 'Desktop / Root',
      icon: <Monitor size={20} />,
      commands: [
        { id: 'fresh-start', name: 'Fresh Start', command: 'npm run fresh-start', description: 'Rebuild + Vite + Electron', directory: './' },
        { id: 'electron-dev', name: 'Electron Dev', command: 'npm run electron-dev', description: 'Només dev server', directory: './' },
        { id: 'clean-install', name: 'Clean Install', command: 'rm -rf node_modules package-lock.json dist && npm install', description: 'Neteja profunda i reinstal·lació', directory: './' },
        { id: 'build-linux', name: 'Build Linux', command: 'npm ci && npm run build:linux', description: 'Compilar AppImage', directory: './' }
      ]
    },
    {
      id: 'mobile-dev',
      name: 'Mobile App',
      icon: <Smartphone size={20} />,
      commands: [
        { id: 'mobile-reset', name: 'Mobile Reset', command: 'rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm start -- --clear', description: 'Reset total i start', directory: 'mobile_app' },
        { id: 'mobile-start', name: 'Mobile Start', command: 'npm start -- --clear', description: 'Start amb neteja de cache', directory: 'mobile_app' },
        { id: 'mobile-install', name: 'Mobile Install', command: 'npm install --legacy-peer-deps', description: 'Instal·lar dependències', directory: 'mobile_app' }
      ]
    }
  ]
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [projectPath, setProjectPath] = useState('');
  const [lastRunId, setLastRunId] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    const savedPath = localStorage.getItem('projectPath');
    if (savedPath) setProjectPath(savedPath);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const selectProjectFolder = async () => {
    if (window.electron) {
      const path = await window.electron.ipcRenderer.invoke('select-directory');
      if (path) {
        setProjectPath(path);
        localStorage.setItem('projectPath', path);
      }
    }
  };

  const runCommand = (cmd) => {
    if (!projectPath) return alert("Selecciona primer la carpeta del projecte!");

    // Calculem la ruta real absoluta
    let cwd = projectPath;
    if (cmd.directory && cmd.directory !== './' && cmd.directory !== '.') {
      // Si estem a Windows seria \, però a Linux és /
      cwd = `${projectPath}/${cmd.directory}`;
    }

    if (window.electron) {
      window.electron.ipcRenderer.invoke('run-in-mate', {
        command: cmd.command,
        cwd: cwd
      });
      
      // Feedback visual
      setLastRunId(cmd.id);
      setTimeout(() => setLastRunId(null), 2000);
    }
  };

  // Colors
  const bgClass = theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardClass = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const btnHover = theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100';

  return (
    <div className={`min-h-screen p-6 ${bgClass} font-sans transition-colors duration-300`}>
      
      {/* HEADER */}
      <div className={`max-w-4xl mx-auto rounded-xl shadow-xl p-6 mb-8 ${cardClass} border`}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Terminal className="text-green-500" /> Dev Launcher
            </h1>
            <button onClick={toggleTheme} className={`p-2 rounded-full ${btnHover}`}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Selector de Ruta */}
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${theme === 'dark' ? 'bg-black/30 border-slate-600' : 'bg-slate-100 border-slate-300'}`}>
            <FolderOpen className="opacity-50" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold uppercase opacity-50 tracking-wider">Carpeta del Projecte</p>
              <p className="text-sm truncate font-mono text-blue-400">
                {projectPath || "⚠️ Selecciona la carpeta arrel del projecte"}
              </p>
            </div>
            <button 
              onClick={selectProjectFolder}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md text-sm font-bold transition-colors"
            >
              Canviar
            </button>
          </div>
        </div>
      </div>

      {/* Graella de Comandes */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultCommands.categories.map(category => (
          <div key={category.id} className={`rounded-xl shadow-lg overflow-hidden border ${cardClass}`}>
            <div className={`p-4 border-b flex items-center gap-2 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                {category.icon}
              </div>
              <h2 className="font-bold text-lg">{category.name}</h2>
            </div>

            <div className="p-2">
              {category.commands.map(cmd => (
                <div key={cmd.id} className="group relative p-2">
                  <button
                    onClick={() => runCommand(cmd)}
                    disabled={!projectPath}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between group-hover:shadow-md group-hover:translate-x-1
                      ${theme === 'dark' 
                        ? 'bg-slate-900/50 border-slate-700 hover:border-green-500 hover:bg-slate-800' 
                        : 'bg-white border-slate-200 hover:border-green-400 hover:bg-green-50'
                      } ${!projectPath ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-2 text-lg">
                        {cmd.name}
                      </div>
                      <div className="text-xs opacity-60 mt-1 font-mono truncate max-w-[250px]">
                        {cmd.command}
                      </div>
                    </div>

                    <div className={`p-3 rounded-full transition-all duration-300 ${lastRunId === cmd.id ? 'bg-green-500 text-white scale-110' : 'bg-slate-700/10 text-slate-400 group-hover:text-green-500 group-hover:bg-green-500/10'}`}>
                      <Play size={24} fill={lastRunId === cmd.id ? "currentColor" : "none"} />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-center mt-8 opacity-30 text-sm font-mono">En clicar s'obrirà una terminal MATE executant la comanda.</p>
    </div>
  );
}

export default App;