# Dev Command Runner

## Estructura final del projecte

### Fitxers principals:
- **electron-app.js** - Punt d'entrada principal d'Electron
- **main.js** - IPC handlers per ejecutar comandes
- **preload.js** - Script de precàrrega per seguretat
- **src/dev-command-runner.jsx** - Componente React principal
- **src/index.js** - Entrada de React
- **src/index.css** - Estilos Tailwind CSS
- **package.json** - Dependències i scripts
- **public/index.html** - HTML d'entrada

### Estructura de carpetes:
```
Dev Command Runner/
├── src/
│   ├── dev-command-runner.jsx    (Componente React)
│   ├── index.js                  (Entrada React)
│   └── index.css                 (Estilos)
├── public/
│   └── index.html                (HTML d'entrada)
├── electron-app.js               (Entrada principal Electron)
├── main.js                       (IPC handlers)
├── preload.js                    (Preload segur)
├── package.json                  (Dependències)
├── tailwind.config.js            (Config Tailwind)
├── postcss.config.js             (Config PostCSS)
├── .gitignore                    (Arxius ignorats)
└── README.md                     (Documentació)
```

## Com executar

```bash
# Instal·lar dependències
npm install

# Mode desenvolupament (React + Electron)
npm run dev

# Compilar per a producció
npm run build

# Solo React (sense Electron)
npm run react-start
```

## Status: ✓ COMPLETAT

El projecte està completament funcional amb:
- ✅ Execució real de comandes (sense simulació)
- ✅ Sortida en temps real
- ✅ Integració amb mate-terminal
- ✅ Gestor de comandes
- ✅ Import/Export de configuració
- ✅ Mode clar/fosc
- ✅ Seguretat amb preload
- ✅ Build per a Linux
