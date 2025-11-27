# Dev Command Runner

Una aplicació Electron senzilla per gestionar i copiar comandes de desenvolupament al portapapers.

## 🚀 Característiques

- ✅ **Copiar comandes al portapapers** amb un sol clic
- ✅ **Obrir terminal** al directori correcte del projecte
- ✅ **Compatible multiplataforma**: Windows, macOS i Linux
- ✅ **Mode clar/fosc** personalitzable
- ✅ **Gestió de categories** per organitzar comandes
- ✅ **Interfície moderna** amb Tailwind CSS

## 📦 Instal·lació

```bash
# Clonar el repositori
git clone https://github.com/Pepelocotango/DEV_COMMAND_RUNNER.git
cd DEV_COMMAND_RUNNER

# Instal·lar dependències
npm install
```

## 🎯 Ús

### Mode Desenvolupament

```bash
npm run dev
```

Això iniciarà:
- Servidor Vite a `http://localhost:5173`
- Aplicació Electron automàticament

### Compilar per Producció

```bash
npm run build
```

## 💡 Com Funciona

1. **Selecciona la carpeta del projecte** amb el botó "Canviar"
2. **Clica una comanda** per copiar-la al portapapers
3. **Clica "Terminal"** per obrir una terminal al directori correcte
4. **Enganxa la comanda** (Ctrl+V / Cmd+V) a la terminal
5. **Executa** la comanda manualment

## 🛠️ Tecnologies

- **Electron** - Framework per aplicacions d'escriptori
- **React** - Biblioteca UI
- **Vite** - Build tool ràpid
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icones modernes

## 📁 Estructura del Projecte

```
DEV_COMMAND_RUNNER/
├── src/
│   ├── dev-command-runner.jsx    # Component React principal
│   ├── index.jsx                 # Punt d'entrada React
│   └── index.css                 # Estilos Tailwind
├── electron-app.js               # Punt d'entrada Electron
├── main.js                       # IPC handlers
├── preload.js                    # Script de preload segur
├── package.json                  # Dependències
└── vite.config.js                # Configuració Vite
```

## 🔧 Configuració

Pots personalitzar les comandes editant l'objecte `defaultCommands` a `src/dev-command-runner.jsx`:

```javascript
const defaultCommands = {
  categories: [
    {
      id: 'my-category',
      name: 'La Meva Categoria',
      icon: <Monitor size={20} />,
      commands: [
        { 
          id: 'my-command', 
          name: 'La Meva Comanda', 
          command: 'npm run my-script', 
          description: 'Descripció de la comanda', 
          directory: './' 
        }
      ]
    }
  ]
};
```

## 🌍 Compatibilitat

| Sistema Operatiu | Terminal per Defecte |
|------------------|---------------------|
| Windows 10/11    | PowerShell          |
| macOS            | Terminal.app        |
| Linux (GNOME)    | gnome-terminal      |
| Linux (KDE)      | konsole             |
| Linux (XFCE)     | xfce4-terminal      |
| Linux (MATE)     | mate-terminal       |

## 📝 Llicència

Aquest projecte està sota la llicència especificada al fitxer [LICENSE](LICENSE).

## 👤 Autor

**Pep**

## 🤝 Contribucions

Les contribucions són benvingudes! Si tens suggeriments o millores, obre un issue o pull request.

---

**Nota**: Aquesta aplicació ha estat simplificada per ser més fiable i compatible amb tots els sistemes operatius. Ja no intenta escriure automàticament a la terminal, sinó que copia les comandes al portapapers perquè l'usuari les enganxi manualment.
