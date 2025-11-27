# Dev Command Runner

Una aplicació Electron + React per gestionar i executar comandes de desenvolupament en Linux MATE 20.04.

## Característiques

✅ **Execució de comandes reals** amb sortida en temps real  
✅ **Gestor de comandes** organitzades per categories  
✅ **Importar/Exportar** configuracions  
✅ **Mode clar/fosc** per la UI  
✅ **Integració amb mate-terminal** per obrir comandes en terminal  
✅ **Persistència** amb localStorage  

## Estructura del Projecte

```
.
├── main.js                    # Procés principal d'Electron (IPC handlers)
├── preload.js                 # Script preload per seguretat
├── dev-command-runner.tsx     # Componente React principal
├── package.json               # Dependències i scripts
└── public/index.html          # HTML d'entrada (creat per react-scripts)
```

## Instal·lació

### 1. Instal·lar Node.js (si no el tens)
```bash
sudo apt update
sudo apt install nodejs npm
```

### 2. Instal·lar dependències
```bash
npm install
```

### 3. Instal·lar Tailwind CSS (opcional, si necessites estilos personalitzats)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Execució

### Mode desenvolupament
```bash
npm run dev
```

Això executarà React a `http://localhost:3000` i obrirà Electron automàticament.

### Mode producció (compilar)
```bash
npm run build
```

Genera un executable `.AppImage` a la carpeta `dist/`.

### Solo React (per testejar la UI sense Electron)
```bash
npm run react-start
```

### Solo Electron (si ja tens React compilat)
```bash
electron .
```

## Com funciona

### Arquitectura de Procés

```
┌─────────────────────────────────┐
│     React Renderer Process      │
│  (dev-command-runner.tsx)       │
│  - UI de comandes             │
│  - Entrada de l'usuari         │
│  - Mostra sortida              │
└──────────────┬──────────────────┘
               │
           IPC Bridge
               │
┌──────────────▼──────────────────┐
│   Electron Main Process         │
│  (main.js)                      │
│  - Executa comandes reals       │
│  - Maneja child_process         │
│  - Envia sortida al renderer   │
└──────────────────────────────────┘
               │
        Procés del Sistema
               │
        (bash, npm, git, etc.)
```

### Seguretat

- **preload.js**: Exposa només les funcions IPC necessàries
- **Sandbox habitat**: Les finestres d'Electron s'executen amb sandbox per evitar accés al sistema directe
- **Timeout**: Totes les comandes tenen un timeout de 5 minuts

## Comandes Per Defecte

### Desktop Development
- **Fresh Start**: `npm run fresh-start`
- **Electron Dev**: `npm run electron-dev`
- **Clean Install**: `rm -rf node_modules && npm install`
- **Build Theme**: `npm run build:theme`

### Mobile Development
- **Mobile Reset**: Reset total de l'app mòbil
- **Mobile Start**: Inicia Expo amb cache clear
- **Mobile Install**: Instal·la dependències mòbils

### Build & Production
- **Build Linux**: Compila per a Linux
- **Build Only**: Compila TypeScript i frontend

## Editant Comandes

1. Fes clic al botó `+` en qualsevol categoria per afegir una comanda nova
2. Edita el nom, comanda, descripció i directori
3. Fes clic a `Guardar`

Les comandes es guarden automàticament a localStorage.

## Exportar/Importar Configuració

- **Exportar**: Fes clic al botó de descàrrega per guardar les comandes en un fitxer `dev-commands.json`
- **Importar**: Fes clic al botó de carpeta per carregar una configuració exportada

## Troubleshooting

### "mate-terminal: command not found"
```bash
sudo apt install mate-terminal
```

### Les comandes no s'executen dins d'Electron
Verifica que `main.js` i `preload.js` estiguin en el mateix directori que `package.json`.

### Problemes amb localStorage
Neteja els dades de l'aplicació:
- A la finestra d'Electron, prem `F12` per obrir DevTools
- Console → `localStorage.clear()`

### Electron no s'obre
```bash
npm install electron --save-dev --force
npm run dev
```

## Desenvolupament

### Afegir una nova categoria
Edita `defaultCommands` en `dev-command-runner.tsx`:

```typescript
{
  id: 'my-category',
  name: 'Meu Grup de Comandes',
  commands: [
    {
      id: 'my-command',
      name: 'La Meva Comanda',
      command: 'echo "Hola"',
      description: 'Una comanda de prova',
      directory: './'
    }
  ]
}
```

### Scripts de React disponibles

```bash
npm run react-start    # Inicia React dev server
npm run react-build    # Compila React
npm run react-test     # Executa tests
npm run react-eject    # Eject de create-react-app (irreversible)
```

## Build i Distribució

### Crear executable Linux
```bash
npm run build
```

Això crea:
- `dist/Dev Command Runner-1.0.0.AppImage` - Executable autònom
- `dist/Dev Command Runner-1.0.0.deb` - Paquet Debian

### Instal·lar el .deb
```bash
sudo dpkg -i "Dev Command Runner-1.0.0.deb"
```

## Llicència

MIT

---

**Desenvolupat per a Linux MATE 20.04**
