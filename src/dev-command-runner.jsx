import React, { useState, useEffect } from 'react';
import { Terminal, FolderOpen, Sun, Moon, Copy, Smartphone, Monitor, ExternalLink, GitBranch, Package, Box, Plus, Edit2, Trash2, X, Save, ChevronDown, RotateCcw, Settings, FileJson, HelpCircle } from 'lucide-react';

// Comandes per defecte
const defaultCommands = {
  categories: [
    {
      id: 'dependencies',
      name: 'Dependències i Neteja',
      icon: 'Package',
      commands: [
        { id: 'npm-install', name: 'Instal·lació Estàndard', command: 'npm install', description: 'Instal·la les dependències del package.json.', directory: './' },
        { id: 'clean-install', name: 'Reinstal·lació Neta', command: 'rm -rf node_modules package-lock.json dist && npm install', description: 'Esborra node_modules i lockfiles per començar de zero.', directory: './' },
      ]
    },
    {
      id: 'development',
      name: 'Desenvolupament',
      icon: 'Monitor',
      commands: [
        { id: 'dev-server', name: 'Iniciar Servidor Dev', command: 'npm run dev', description: 'Arranca el servidor local amb hot-reload.', directory: './' },
        { id: 'electron-dev', name: 'Electron Dev Mode', command: 'npm run electron-dev', description: 'Inicia només la finestra d\'Electron.', directory: './' }
      ]
    },
    {
      id: 'mobile-dev',
      name: 'Mobile App',
      icon: 'Smartphone',
      commands: [
        { id: 'mobile-reset', name: 'Mobile Reset', command: 'rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm start -- --clear', description: 'Reset total i start', directory: 'mobile_app' },
        { id: 'mobile-start', name: 'Mobile Start', command: 'npm start -- --clear', description: 'Start amb neteja de cache', directory: 'mobile_app' },
        { id: 'mobile-install', name: 'Mobile Install', command: 'npm install --legacy-peer-deps', description: 'Instal·lar dependències', directory: 'mobile_app' }
      ]
    },
    {
      id: 'build',
      name: 'Build i Producció',
      icon: 'Box',
      commands: [
        { id: 'build-prod', name: 'Compilar Producció', command: 'npm run build', description: 'Genera els fitxers optimitzats.', directory: './' },
      ]
    },
    {
      id: 'git',
      name: 'Git Helpers',
      icon: 'GitBranch',
      commands: [
        { id: 'git-status', name: 'Estat del Repositori', command: 'git status', description: 'Mostra canvis pendents.', directory: './' },
        { id: 'git-pull', name: 'Actualitzar (Pull)', command: 'git pull', description: 'Descarrega canvis del remot.', directory: './' },
      ]
    }
  ]
};

// Helper per renderitzar icones
const IconRenderer = ({ name, size = 20, className = "" }) => {
  const icons = { Terminal, FolderOpen, Sun, Moon, Copy, Smartphone, Monitor, ExternalLink, GitBranch, Package, Box, HelpCircle };
  const Icon = icons[name] || Box;
  return <Icon size={size} className={className} />;
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [projectPath, setProjectPath] = useState('');
  const [lastCopiedId, setLastCopiedId] = useState(null);

  const [commandsData, setCommandsData] = useState(() => {
    try {
      const saved = localStorage.getItem('dev-command-runner-data');
      return saved ? JSON.parse(saved) : defaultCommands;
    } catch (e) {
      return defaultCommands;
    }
  });

  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);
  const [targetCategory, setTargetCategory] = useState(null);

  // Config Manager State
  const [isConfigManagerOpen, setIsConfigManagerOpen] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [newConfigName, setNewConfigName] = useState('');
  const [currentConfig, setCurrentConfig] = useState({ name: 'No configurat', path: '' });
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dev-command-runner-data', JSON.stringify(commandsData));
  }, [commandsData]);

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

  const toggleCategory = (catId) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const toggleAllCategories = () => {
    const newState = !allCollapsed;
    const newCollapsed = {};
    commandsData.categories.forEach(cat => {
      newCollapsed[cat.id] = newState;
    });
    setCollapsedCategories(newCollapsed);
    setAllCollapsed(newState);
  };

  const resetDefaults = () => {
    if (window.confirm("Restaurar comandes per defecte?")) {
      setCommandsData(defaultCommands);
      localStorage.removeItem('dev-command-runner-data');
    }
  };

  const selectProjectFolder = async () => {
    if (!window.electron) return;
    try {
      const path = await window.electron.selectDirectory();
      if (path) {
        setProjectPath(path);
        localStorage.setItem('projectPath', path);
      }
    } catch (err) {
      console.error('Error seleccionant carpeta del projecte:', err);
      alert('Error seleccionant la carpeta del projecte.');
    }
  };

  const copyToClipboard = async (cmd) => {
    try {
      await navigator.clipboard.writeText(cmd.command);
      setLastCopiedId(cmd.id);
      setTimeout(() => setLastCopiedId(null), 2000);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const openTerminal = async (directory) => {
    if (!projectPath) return alert("Selecciona carpeta!");
    let cwd = projectPath;
    if (directory && directory !== './' && directory !== '.') {
      cwd = projectPath.endsWith('\\') || projectPath.endsWith('/')
        ? projectPath + directory
        : projectPath + '/' + directory;
    }
    if (!window.electron) return;
    try {
      const result = await window.electron.openTerminal(cwd);
      if (!result || result.success === false) {
        alert(result?.msg || 'No s\'ha pogut obrir el terminal.');
      }
    } catch (err) {
      console.error('Error obrint el terminal:', err);
      alert('No s\'ha pogut obrir el terminal.');
    }
  };

  const handleAddCommand = (catId) => {
    setTargetCategory(catId);
    setEditingCommand(null);
    setIsModalOpen(true);
  };

  const handleEditCommand = (catId, cmd) => {
    setTargetCategory(catId);
    setEditingCommand(cmd);
    setIsModalOpen(true);
  };

  const handleDeleteCommand = (catId, cmdId) => {
    if (!window.confirm("Eliminar comanda?")) return;
    const newCategories = commandsData.categories.map(cat => {
      if (cat.id === catId) {
        return { ...cat, commands: cat.commands.filter(c => c.id !== cmdId) };
      }
      return cat;
    });
    setCommandsData({ categories: newCategories });
  };

  const saveCommand = (formData) => {
    const newCategories = commandsData.categories.map(cat => {
      if (cat.id === targetCategory) {
        let newCommands = [...cat.commands];
        if (editingCommand) {
          newCommands = newCommands.map(c => c.id === editingCommand.id ? { ...formData, id: c.id } : c);
        } else {
          newCommands.push({ ...formData, id: Date.now().toString() });
        }
        return { ...cat, commands: newCommands };
      }
      return cat;
    });
    setCommandsData({ categories: newCategories });
    setIsModalOpen(false);
  };

  // --- CONFIG MANAGER FUNCTIONS ---

  const loadConfigsList = async () => {
    if (!window.electron) return;
    try {
      const configs = await window.electron.getConfigs();
      setSavedConfigs(configs);
      const configPath = await window.electron.getConfigPath();
      setCurrentConfig(prev => ({
        ...prev,
        path: configPath
      }));
    } catch (err) {
      console.error('Error carregant la llista de configuracions:', err);
      alert('Error carregant la llista de configuracions.');
    }
  };

  const handleOpenConfigManager = () => {
    loadConfigsList();
    setIsConfigManagerOpen(true);
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!newConfigName.trim()) return;
    if (!window.electron) return;
    try {
      const result = await window.electron.saveConfig({
        name: newConfigName,
        data: commandsData
      });
      if (result.success) {
        setNewConfigName('');
        setCurrentConfig({ name: newConfigName, path: '' });
        loadConfigsList();
        alert('Configuració guardada correctament!');
      } else {
        alert('Error guardant configuració: ' + (result.error || 'Error desconegut'));
      }
    } catch (err) {
      console.error('Error guardant configuració:', err);
      alert('Error guardant configuració.');
    }
  };

  const handleLoadConfig = async (name) => {
    if (!window.confirm(`Vols carregar la configuració "${name}"? Es perdran els canvis no guardats.`)) return;
    if (!window.electron) return;
    try {
      const data = await window.electron.loadConfig(name);
      if (data) {
        setCommandsData(data);
        const configPath = await window.electron.getConfigPath();
        setCurrentConfig({ name, path: configPath });
        setIsConfigManagerOpen(false);
      } else {
        alert('Error carregant la configuració.');
      }
    } catch (err) {
      console.error('Error carregant la configuració:', err);
      alert('Error carregant la configuració.');
    }
  };

  const handleDeleteConfig = async (name) => {
    if (!window.confirm(`Segur que vols esborrar la configuració "${name}"?`)) return;
    if (!window.electron) return;
    try {
      const result = await window.electron.deleteConfig(name);
      if (result.success) {
        loadConfigsList();
      } else {
        alert('Error esborrant configuració: ' + (result.error || 'Error desconegut'));
      }
    } catch (err) {
      console.error('Error esborrant configuració:', err);
      alert('Error esborrant configuració.');
    }
  };

  const bgClass = theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardClass = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const btnHover = theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100';
  const commandBg = theme === 'dark' ? 'bg-black/40' : 'bg-slate-100';

  return (
    <div className={`min-h-screen p-6 ${bgClass} font-sans transition-colors duration-300`}>
      <div className={`max-w-6xl mx-auto rounded-xl shadow-xl p-6 mb-8 ${cardClass} border`}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Terminal className="text-green-500" size={32} /> Dev Command Runner
              </h1>
              <div className="mt-1 flex flex-col gap-1 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Configuració:</span>
                  <span className="font-mono bg-slate-700/50 px-2 py-0.5 rounded">{currentConfig.name}</span>
                </div>
                {currentConfig.path && (
                  <div className="flex items-start gap-2 text-xs opacity-60">
                    <span>Ruta:</span>
                    <span className="font-mono bg-slate-800/30 px-2 py-0.5 rounded break-all">{currentConfig.path}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAllCategories}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}
              >
                {allCollapsed ? 'Expandir tot' : 'Replegar tot'}
              </button>
              <button onClick={handleOpenConfigManager} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}>
                <Settings size={18} /> Configuracions
              </button>
              <button
                onClick={() => setIsAboutOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
              >
                <HelpCircle size={18} /> Ajuda
              </button>
              <div className="w-px h-8 bg-slate-500/30 mx-2"></div>
              <button onClick={resetDefaults} className={`p-2 rounded-full ${btnHover}`} title="Restaurar">
                <RotateCcw size={20} className="text-slate-400 hover:text-red-400 transition-colors" />
              </button>
              <button onClick={toggleTheme} className={`p-2 rounded-full ${btnHover}`}>
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>

          <div className={`flex items-center gap-4 p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/30 border-slate-600' : 'bg-slate-100 border-slate-300'}`}>
            <FolderOpen className="opacity-50" size={24} />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold uppercase opacity-50 tracking-wider mb-1">Carpeta del Projecte</p>
              <p className="text-lg truncate font-mono text-blue-400 font-medium">
                {projectPath || "⚠️ Selecciona la carpeta arrel del projecte"}
              </p>
            </div>
            <button onClick={selectProjectFolder} className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg">
              Canviar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {commandsData.categories.map(category => (
          <div key={category.id} className={`rounded-xl shadow-lg overflow-hidden border ${cardClass}`}>
            <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleCategory(category.id)}>
                <button className={`p-1 rounded-full transition-transform ${collapsedCategories[category.id] ? '-rotate-90' : 'rotate-0'}`}>
                  <ChevronDown size={24} />
                </button>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                    <IconRenderer name={category.icon} />
                  </div>
                  <h2 className="font-bold text-xl">{category.name}</h2>
                  <span className="text-xs opacity-50 bg-slate-500/20 px-2 py-0.5 rounded-full">
                    {category.commands.length} comandes
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleAddCommand(category.id)} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-green-500/20 text-green-400' : 'hover:bg-green-100 text-green-600'}`}>
                  <Plus size={20} />
                </button>
                <button
                  onClick={() => openTerminal(category.commands[0]?.directory || './')}
                  disabled={!projectPath}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md
                    ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} 
                    ${!projectPath ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ExternalLink size={18} /> Terminal
                </button>
              </div>
            </div>

            {!collapsedCategories[category.id] && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.commands.map(cmd => (
                  <div key={cmd.id} className="group relative">
                    <div className={`w-full text-left p-5 rounded-xl border transition-all duration-200 flex flex-col gap-3 group-hover:shadow-lg
                      ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-200 hover:border-blue-400'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-slate-200 dark:text-white">{cmd.name}</span>
                          {lastCopiedId === cmd.id && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse font-bold">✓ COPIAT</span>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditCommand(category.id, cmd)} className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteCommand(category.id, cmd.id)} className="p-1.5 hover:bg-red-500/20 text-red-400 rounded"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(cmd)}
                        className={`font-mono text-sm p-3 rounded-lg border ${commandBg} ${theme === 'dark' ? 'border-slate-700 text-green-400' : 'border-slate-200 text-blue-700'} 
                        text-left break-all hover:scale-[1.01] transition-transform active:scale-95 flex justify-between items-center group/cmd`}
                      >
                        <span>{cmd.command}</span>
                        <Copy size={16} className="opacity-0 group-hover/cmd:opacity-100 transition-opacity" />
                      </button>
                      <div className="text-sm opacity-70">{cmd.description}</div>
                    </div>
                  </div>
                ))}
                {category.commands.length === 0 && (
                  <div className="col-span-2 text-center p-8 opacity-40 border-2 border-dashed border-slate-700 rounded-xl">
                    No hi ha comandes. Clica "+" per afegir-ne una.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Editar/Crear Comanda */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-xl shadow-2xl p-6 ${cardClass} border animate-in fade-in zoom-in duration-200`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingCommand ? 'Editar Comanda' : 'Nova Comanda'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-700 rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              saveCommand({
                name: formData.get('name'),
                command: formData.get('command'),
                description: formData.get('description'),
                directory: formData.get('directory') || './'
              });
            }} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold mb-1 opacity-70">Nom</label>
                <input name="name" defaultValue={editingCommand?.name} required placeholder="Ex: Build Prod"
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-600' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 opacity-70">Comanda</label>
                <textarea name="command" defaultValue={editingCommand?.command} required placeholder="npm run build" rows={3}
                  className={`w-full p-3 rounded-lg border font-mono text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-600 text-green-400' : 'bg-slate-50 border-slate-300 text-blue-700'}`} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 opacity-70">Descripció</label>
                <input name="description" defaultValue={editingCommand?.description} placeholder="Què fa aquesta comanda?"
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-600' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 opacity-70">Directori (relatiu)</label>
                <input name="directory" defaultValue={editingCommand?.directory || './'} placeholder="./"
                  className={`w-full p-3 rounded-lg border font-mono text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-600' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">Cancel·lar</button>
                <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center gap-2">
                  <Save size={18} /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gestor Configuracions */}
      {isConfigManagerOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-2xl rounded-xl shadow-2xl p-6 ${cardClass} border animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Settings className="text-purple-500" /> Gestor de Configuracions
              </h2>
              <button onClick={() => setIsConfigManagerOpen(false)} className="p-2 hover:bg-slate-700 rounded-full"><X size={24} /></button>
            </div>

            <div className="flex flex-col gap-6 overflow-hidden">
              {/* Guardar Nova */}
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-slate-600' : 'bg-slate-50 border-slate-300'}`}>
                <h3 className="font-bold mb-3 text-sm opacity-70 uppercase tracking-wider">Guardar Configuració Actual</h3>
                <form onSubmit={handleSaveConfig} className="flex gap-3">
                  <input
                    type="text"
                    value={newConfigName}
                    onChange={(e) => setNewConfigName(e.target.value)}
                    placeholder="Nom de la configuració (ex: Projecte React)"
                    className={`flex-1 p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-600' : 'bg-white border-slate-300'}`}
                  />
                  <button type="submit" disabled={!newConfigName.trim()} className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold flex items-center gap-2">
                    <Save size={18} /> Guardar
                  </button>
                </form>
              </div>

              {/* Llista Configuracions */}
              <div className="flex-1 overflow-y-auto min-h-[200px]">
                <h3 className="font-bold mb-3 text-sm opacity-70 uppercase tracking-wider">Configuracions Guardades</h3>
                {savedConfigs.length === 0 ? (
                  <div className="text-center p-8 opacity-40 border-2 border-dashed border-slate-700 rounded-xl">
                    No hi ha configuracions guardades.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {savedConfigs.map(configName => (
                      <div key={configName} className={`p-4 rounded-lg border flex items-center justify-between group ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 hover:border-purple-500' : 'bg-white border-slate-200 hover:border-purple-400'}`}>
                        <div className="flex items-center gap-3">
                          <FileJson className="text-purple-400" size={24} />
                          <span className="font-bold text-lg">{configName}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleLoadConfig(configName)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors"
                          >
                            Carregar
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(configName)}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sobre l'aplicació */}
      {isAboutOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-xl shadow-2xl p-6 ${cardClass} border animate-in fade-in zoom-in duration-200`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <HelpCircle className="text-blue-400" />
                Sobre Dev Command Runner
              </h2>
              <button onClick={() => setIsAboutOpen(false)} className="p-2 hover:bg-slate-700 rounded-full"><X size={24} /></button>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                Dev Command Runner és una petita eina d'escriptori per centralitzar les comandes típiques
                de desenvolupament d'un projecte (install, build, scripts de mobile, helpers de Git, etc.).
              </p>
              <p>
                Pots personalitzar les categories i comandes, guardar diferents configuracions i reutilitzar-les
                fàcilment segons el projecte amb què estiguis treballant.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs opacity-80 mt-4">
                <div>
                  <div className="font-semibold">Versió</div>
                  <div className="font-mono">v1.0.0</div>
                </div>
                <div>
                  <div className="font-semibold">Autor</div>
                  <div className="font-mono">Pep</div>
                </div>
              </div>
              <div className="mt-4 text-xs opacity-70">
                Consell: selecciona la carpeta arrel del projecte i fes servir les comandes com a plantilla;
                copia-les o obre ràpidament un terminal en el directori corresponent.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;