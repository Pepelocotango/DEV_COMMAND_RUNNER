# Guia d'Instal·lació per Windows 10
## Configuració d'Entorn de Desenvolupament

Aquesta guia t'ajudarà a configurar un nou usuari de Windows 10 per treballar amb projectes com **Dev Command Runner** (Electron + React + Vite).

---

## 📋 Software Essencial a Instal·lar

### 1. **Node.js i npm**

Node.js és imprescindible per executar JavaScript al servidor i gestionar dependències.

**Descàrrega i Instal·lació:**
- Visita: https://nodejs.org/
- Descarrega la versió **LTS** (Long Term Support) - recomanat v18.x o superior
- Executa l'instal·lador i segueix els passos
- **IMPORTANT**: Marca l'opció "Automatically install the necessary tools" durant la instal·lació

**Verificació:**
```bash
node --version
npm --version
```

---

### 2. **Git**

Sistema de control de versions essencial per gestionar el codi.

**Descàrrega i Instal·lació:**
- Visita: https://git-scm.com/download/win
- Descarrega i instal·la Git for Windows
- Durant la instal·lació:
  - Selecciona "Git from the command line and also from 3rd-party software"
  - Selecciona "Use Windows' default console window" o "Use MinTTY"

**Configuració inicial:**
```bash
git config --global user.name "El Teu Nom"
git config --global user.email "el.teu@email.com"
```

**Verificació:**
```bash
git --version
```

---

### 3. **Editor de Codi: Visual Studio Code**

L'editor més popular per desenvolupament web.

**Descàrrega i Instal·lació:**
- Visita: https://code.visualstudio.com/
- Descarrega i instal·la
- Durant la instal·lació, marca:
  - ✅ "Add to PATH"
  - ✅ "Register Code as an editor for supported file types"
  - ✅ "Add 'Open with Code' action to Windows Explorer context menu"

**Extensions Recomanades:**
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- GitLens

**Instal·lar extensions des de la terminal:**
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension eamodio.gitlens
```

---

### 4. **Windows Terminal (Opcional però recomanat)**

Terminal moderna i personalitzable per Windows.

**Instal·lació:**
- Obre Microsoft Store
- Cerca "Windows Terminal"
- Instal·la

O descarrega des de: https://github.com/microsoft/terminal/releases

---

### 5. **Python (Opcional - per algunes dependències natives)**

Algunes dependències de Node.js necessiten Python per compilar.

**Descàrrega i Instal·lació:**
- Visita: https://www.python.org/downloads/
- Descarrega Python 3.x
- **IMPORTANT**: Marca "Add Python to PATH" durant la instal·lació

**Verificació:**
```bash
python --version
```

---

### 6. **Build Tools per Windows**

Necessàries per compilar dependències natives de Node.js.

**Instal·lació automàtica:**
```bash
npm install -g windows-build-tools
```

O manualment:
- Descarrega Visual Studio Build Tools: https://visualstudio.microsoft.com/downloads/
- Selecciona "Desktop development with C++"

---

## 🚀 Configuració del Projecte Dev Command Runner

### 1. **Clonar el Repositori**

```bash
cd C:\Users\[NomUsuari]\Documents\GitHub
git clone https://github.com/Pepelocotango/DEV_COMMAND_RUNNER.git
cd DEV_COMMAND_RUNNER
```

### 2. **Instal·lar Dependències**

```bash
npm install
```

### 3. **Executar en Mode Desenvolupament**

```bash
npm run dev
```

Això iniciarà:
- Servidor Vite a http://localhost:5173
- Aplicació Electron automàticament

### 4. **Compilar per Producció**

```bash
npm run build
```

---

## 🛠️ Eines Addicionals Recomanades

### **Navegadors per Desenvolupament**
- **Google Chrome** - Millors DevTools
- **Firefox Developer Edition** - Bones eines per CSS Grid/Flexbox

### **Gestors de Paquets Alternatius**
```bash
# Yarn (alternativa a npm)
npm install -g yarn

# pnpm (més ràpid i eficient)
npm install -g pnpm
```

### **Eines Globals Útils**
```bash
# Nodemon - reinicia automàticament l'app quan canvia el codi
npm install -g nodemon

# http-server - servidor HTTP simple
npm install -g http-server

# Electron Forge - per crear apps Electron
npm install -g @electron-forge/cli
```

---

## ✅ Checklist Final

Verifica que tot estigui instal·lat correctament:

```bash
# Node.js i npm
node --version
npm --version

# Git
git --version

# Python (opcional)
python --version

# Visual Studio Code
code --version
```

---

## 🔧 Solució de Problemes Comuns

### **Error: "npm command not found"**
- Reinicia la terminal després d'instal·lar Node.js
- Verifica que Node.js estigui al PATH: `echo %PATH%`

### **Error: "la ejecución de scripts está deshabilitada" (PowerShell)**
Aquest és un dels errors més comuns en Windows. PowerShell bloqueja l'execució de scripts per seguretat.

**Solució:**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Després d'executar aquesta comanda, npm funcionarà correctament. Aquesta configuració:
- ✅ Permet executar scripts locals (npm, node, etc.)
- ✅ Requereix signatura per scripts descarregats d'Internet
- ✅ És la configuració recomanada per desenvolupadors

### **Error durant npm install**
- Executa com a administrador: `npm install --force`
- Neteja la caché: `npm cache clean --force`

### **Problemes amb Electron**
- Assegura't que tens permisos d'administrador
- Desactiva temporalment l'antivirus durant la instal·lació

### **Error: "gyp ERR!"**
- Instal·la windows-build-tools: `npm install -g windows-build-tools`
- Reinicia el sistema

---

## 📚 Recursos Addicionals

- [Documentació Node.js](https://nodejs.org/docs/)
- [Documentació Electron](https://www.electronjs.org/docs)
- [Documentació React](https://react.dev/)
- [Documentació Vite](https://vitejs.dev/)
- [Documentació Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎯 Pròxims Passos

1. ✅ Instal·la tot el software llistat
2. ✅ Configura Git amb les teves credencials
3. ✅ Clona el repositori DEV_COMMAND_RUNNER
4. ✅ Executa `npm install`
5. ✅ Prova `npm run dev`
6. 🚀 Comença a desenvolupar!

---

**Nota**: Aquesta configuració et permetrà treballar amb projectes Electron, React, Vue, Angular, i qualsevol altre framework modern de JavaScript.
