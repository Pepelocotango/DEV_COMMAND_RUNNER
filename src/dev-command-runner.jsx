// --- START: src/dev-command-runner.jsx ---
import React, { useState, useEffect } from 'react';
import { Terminal, FolderOpen, Sun, Moon, Type, Settings, Play, Monitor, Smartphone, Trash2, Edit2, Plus, Save, X, Download } from 'lucide-react';

const defaultCommands = {
  categories: [
    {
      id: 'desktop-dev',
      name: 'Desktop / Root',
      icon: <Monitor size={24} />,
      commands: [
        { id: 'fresh-start', name: 'Fresh Start', command: 'npm run fresh-start', description: 'Rebuild + Vite + Electron', directory: './' },
        { id: 'electron-dev', name: 'Electron Dev', command: 'npm run electron-dev', description: 'Només dev server', directory: './' },
        { id: 'clean-install', name: 'Clean Install', command: 'rm -rf node_modules package-lock.json dist && npm install', description: 'Neteja profunda', directory: './' },
      ]
    },
    {
      id: 'mobile-dev',
      name: 'Mobile App',
      icon: <Smartphone size={24} />,
      commands: [
        { id: 'mobile-reset', name: 'Mobile Reset', command: 'rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm start -- --clear', description: 'Reset total', directory: 'mobile_app' },
        { id: 'mobile-start', name: 'Mobile Start', command: 'npm start -- --clear', description: 'Start amb neteja', directory: 'mobile_app' },
      ]
    }
  ]
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [projectPath, setProjectPath] = useState('');
  const [commands, setCommands] = useState(defaultCommands);
  const [terminalOpen, setTerminalOpen] = useState(false);
  
  // Estats per edició
  const [showEditor, setShowEditor] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    const savedPath = localStorage.getItem('projectPath');
    if (savedPath) setProjectPath(savedPath);
    
    const savedCmds = localStorage.getItem('devCommands');
    if (savedCmds) setCommands(JSON.parse(savedCmds));
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

  const openMasterTerminal = async () => {
    if (!projectPath) return alert("Selecciona carpeta primer!");
    if (window.electron) {
      await window.electron.ipcRenderer.invoke('open-terminal', projectPath);
      setTerminalOpen(true);
    }
  };

  const sendCommand = async (cmd) => {
    if (!projectPath) return alert("Selecciona carpeta primer!");
    
    // Gestió de directoris (cd bàsic)
    let fullCommand = cmd.command;
    
    // Si la comanda requereix un subdirectori, afegim el cd al principi
    if (cmd.directory && cmd.directory !== './' && cmd.directory !== '.') {
      // cd directory && comanda
      fullCommand = `cd ${cmd.directory} && ${cmd.command}`;
    } else {
      // Si estem a l'arrel, potser volem assegurar-nos de tornar-hi si la terminal s'ha mogut?
      // Opcional: fullCommand = `cd ${projectPath} && ${cmd.command}`;
      // Per ara ho deixem simple.
    }

    if (window.electron) {
      const res = await window.electron.ipcRenderer.invoke('send-text-to-terminal', fullCommand);
      if (!res.success) {
        alert(res.msg);
        setTerminalOpen(false); // Reset estat si falla
      }
    }
  };

  // --- CRUD Functions (Editor) ---
  const saveCommands = (newCmds) => {
    setCommands(newCmds);
    localStorage.setItem('devCommands', JSON.stringify(newCmds));
  };
  
  const handleEdit = (cmd, catId) => {
    setEditingCommand({ command: { ...cmd }, categoryId: catId });
    setShowEditor(true);
  };

  const handleAdd = (catId) => {
    const newCmd = { id: `cmd-${Date.now()}`, name: 'Nova Comanda', command: 'echo "hola"', description: '', directory: './' };
    setEditingCommand({ command: newCmd, categoryId: catId });
    setShowEditor(true);
  };

  const handleDelete = (cmdId, catId) => {
    if(!confirm("Eliminar comanda?")) return;
    const newCmds = { ...commands };
    const cat = newCmds.categories.find(c => c.id === catId);
    cat.commands = cat.commands.filter(c => c.id !== cmdId);
    saveCommands(newCmds);
  };

  const saveEdit = () => {
    const newCmds = { ...commands };
    const cat = newCmds.categories.find(c => c.id === editingCommand.categoryId);
    const idx = cat.commands.findIndex(c => c.id === editingCommand.command.id);
    if (idx >= 0) cat.commands[idx] = editingCommand.command;
    else cat.commands.push(editingCommand.command);
    saveCommands(newCmds);
    setShowEditor(false);
  };

  // --- Styles ---
  const bgClass = theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardClass = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';

  return (
    <div className={`min-h-screen p-6 ${bgClass} font-sans transition-colors duration-300 flex flex-col gap-6`}>
      
      {/* 1. TOP BAR & PROJECT SELECTOR */}
      <div className={`p-4 rounded-xl shadow-md border flex flex-col md:flex-row gap-4 items-center justify-between ${cardClass}`}>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-900/50">
            <Terminal size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none">Dev Commander</h1>
            <p className="text-xs opacity-50 mt-1">Project Controller</p>
          </div>
        </div>

        <div className="flex-1 w-full flex gap-2 items-center bg-black/10 p-2 rounded-lg border border-transparent hover:border-blue-500/30 transition-all">
          <FolderOpen className="opacity-50 ml-2" size={20} />
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-bold uppercase opacity-40">Directori del Projecte</p>
            <p className="text-sm font-mono truncate text-blue-400 font-bold">
              {projectPath || "⚠️ Selecciona carpeta..."}
            </p>
          </div>
          <button onClick={selectProjectFolder} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md text-xs font-bold">
            CANVIAR
          </button>
        </div>

        <div className="flex gap-2">
           <button onClick={toggleTheme} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
      </div>

      {/* 2. MASTER TERMINAL BUTTON */}
      <div className="flex justify-center">
        <button 
          onClick={openMasterTerminal}
          className={`
            relative group overflow-hidden px-8 py-6 rounded-2xl border-2 transition-all duration-300 w-full max-w-3xl
            ${terminalOpen 
              ? 'bg-green-600/10 border-green-500 hover:bg-green-600/20' 
              : 'bg-blue-600 hover:bg-blue-500 border-blue-400 shadow-xl shadow-blue-900/30 hover:scale-[1.02]'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            {terminalOpen ? (
              <>
                <Terminal size={48} className="text-green-500" />
                <span className="text-2xl font-black text-green-500 uppercase tracking-widest">Terminal Activa</span>
                <span className="text-sm opacity-70">Clica una comanda a sota per escriure-la automàticament</span>
              </>
            ) : (
              <>
                <Play size={48} className="text-white" />
                <span className="text-2xl font-black text-white uppercase tracking-widest">INICIAR TERMINAL EXTERNA</span>
                <span className="text-sm text-blue-100">Obre la finestra on s'executaran les comandes</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* 3. COMMAND GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
        {commands.categories.map(cat => (
          <div key={cat.id} className="space-y-4">
             <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h2 className="text-xl font-bold flex items-center gap-2 opacity-80">
                  {cat.icon} {cat.name}
                </h2>
                <button onClick={() => handleAdd(cat.id)} className="p-1 hover:bg-white/10 rounded"><Plus size={18}/></button>
             </div>

             <div className="space-y-3">
               {cat.commands.map(cmd => (
                 <div key={cmd.id} className={`group relative p-4 rounded-xl border-2 transition-all duration-200 
                    ${theme === 'dark' 
                      ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-750' 
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg'
                    }
                 `}>
                   {/* ACTION AREA (Click to send) */}
                   <div 
                      onClick={() => sendCommand(cmd)} 
                      className="cursor-pointer"
                   >
                     <div className="flex justify-between items-start mb-3">
                       <h3 className="font-bold text-lg">{cmd.name}</h3>
                       <Type size={20} className="opacity-20 group-hover:opacity-100 group-hover:text-blue-500 transition-opacity" />
                     </div>
                     
                     <div className={`p-3 rounded-lg font-mono text-sm break-all leading-relaxed
                        ${theme === 'dark' ? 'bg-black/30 text-green-400' : 'bg-slate-100 text-slate-700'}
                     `}>
                       {cmd.directory && cmd.directory !== './' && <span className="text-yellow-500 mr-2">cd {cmd.directory} &&</span>}
                       {cmd.command}
                     </div>
                     
                     {cmd.description && <p className="mt-2 text-xs opacity-50 italic">{cmd.description}</p>}
                   </div>

                   {/* EDIT TOOLS */}
                   <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => {e.stopPropagation(); handleEdit(cmd, cat.id)}} className="p-1.5 bg-slate-600 text-white rounded hover:bg-blue-600"><Edit2 size={12}/></button>
                      <button onClick={(e) => {e.stopPropagation(); handleDelete(cmd.id, cat.id)}} className="p-1.5 bg-slate-600 text-white rounded hover:bg-red-600"><Trash2 size={12}/></button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        ))}
      </div>

      {/* EDITOR MODAL */}
      {showEditor && editingCommand && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg p-6 rounded-xl shadow-2xl ${cardClass} border`}>
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Editar Comanda</h3>
              <button onClick={() => setShowEditor(false)}><X /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold opacity-50">Nom</label>
                <input className="w-full p-2 rounded bg-transparent border border-white/20" value={editingCommand.command.name} onChange={e => setEditingCommand({...editingCommand, command: {...editingCommand.command, name: e.target.value}})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold opacity-50">Comanda</label>
                <textarea rows="3" className="w-full p-2 rounded bg-transparent border border-white/20 font-mono text-sm" value={editingCommand.command.command} onChange={e => setEditingCommand({...editingCommand, command: {...editingCommand.command, command: e.target.value}})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold opacity-50">Directori (relatiu)</label>
                <input className="w-full p-2 rounded bg-transparent border border-white/20" value={editingCommand.command.directory} onChange={e => setEditingCommand({...editingCommand, command: {...editingCommand.command, directory: e.target.value}})} />
              </div>
              <button onClick={saveEdit} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex justify-center gap-2"><Save size={18}/> Guardar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
// --- END: src/dev-command-runner.jsx ---