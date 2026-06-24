# Autor

Pëp pepelocotango@gmail.com

# Dev Command Runner 🚀

**Dev Command Runner** és una eina d'escriptori moderna dissenyada per simplificar la gestió i execució de comandes de desenvolupament. Oblida't de recordar scripts complexos o de tenir múltiples terminals obertes; centralitza-ho tot en una interfície elegant i intuïtiva.

![Dev Command Runner Screenshot](/app_screenshot_dark_1764412030418.png)

## ✨ Característiques Principals

*   **Gestor de Comandes Visual**: Organitza les teves comandes (npm, git, docker, etc.) en categories clares.
*   **Execució Ràpida**: Copia comandes al porta-retalls o obre una terminal directament al directori correcte amb un sol clic.
*   **Gestor de Configuracions**: Guarda i carrega diferents sets de comandes per a diferents projectes. Canvia de context en segons!
*   **Persistència Local**: Les teves dades es guarden de forma segura al teu ordinador.
*   **Tema Clar/Fosc**: Interfície adaptada a les teves preferències visuals.
*   **Multi-Plataforma**: Funciona a Windows, macOS i Linux.

## 🛠️ Instal·lació i Ús

### Requisits Previs
*   Node.js (v16 o superior)
*   npm

### Passos per començar

1.  **Clonar el repositori**:
    ```bash
    git clone https://github.com/Pepelocotango/DEV_COMMAND_RUNNER.git
    cd DEV_COMMAND_RUNNER
    ```

2.  **Instal·lar dependències**:
    ```bash
    npm install
    ```

3.  **Iniciar en mode desenvolupament**:
    ```bash
    npm run dev
    ```
    Això obrirà l'aplicació en una finestra d'Electron amb hot-reload actiu.

4.  **Compilar per a producció**:
    ```bash
    npm run build
    ```
    Generarà l'executable a la carpeta `dist`.

## 📁 Estructura del Projecte

*   `src/`: Codi font de l'aplicació React (Frontend).
*   `main.js`: Procés principal d'Electron (Backend).
*   `preload.js`: Pont segur entre Electron i React.
*   `configs/`: (Generat automàticament) On es guarden els teus fitxers de configuració JSON.

## ⚙️ Configuració

Les configuracions es guarden automàticament a la carpeta de dades de l'usuari:
*   **Windows**: `%APPDATA%\Dev Command Runner\configs\`
*   **macOS**: `~/Library/Application Support/Dev Command Runner/configs/`
*   **Linux**: `~/.config/Dev Command Runner/configs/`

Pots fer còpies de seguretat d'aquests fitxers JSON o compartir-los amb el teu equip.

## 🤝 Contribució

Les contribucions són benvingudes! Si tens idees per millorar l'eina, no dubtis a obrir un *issue* o enviar un *pull request*.

---
Desenvolupat amb ❤️ per Pep utilitzant Electron, React i Vite.

## Llicència

Aquest projecte està llicenciat sota la llicència **GNU General Public License v3.0**. Consulta el fitxer [LICENSE](LICENSE) per obtenir més detalls.
