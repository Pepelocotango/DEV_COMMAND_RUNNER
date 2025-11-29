const { spawn } = require('child_process');
const net = require('net');

const VITE_PORT = 5173;

function checkPort(port) {
    return new Promise((resolve) => {
        const client = new net.Socket();
        client.connect(port, '127.0.0.1', () => {
            client.destroy();
            resolve(true);
        });
        client.on('error', () => {
            resolve(false);
        });
    });
}

async function waitForVite() {
    console.log('Waiting for Vite...');
    let retries = 0;
    while (retries < 60) { // 60 seconds timeout
        if (await checkPort(VITE_PORT)) {
            console.log('Vite is ready!');
            return;
        }
        await new Promise(r => setTimeout(r, 1000));
        retries++;
    }
    throw new Error('Vite failed to start');
}

// Start Vite
const vite = spawn('npm', ['run', 'vite-dev'], {
    shell: true,
    stdio: 'inherit'
});

// Wait for Vite then start Electron
waitForVite().then(() => {
    const electron = spawn('npm', ['run', 'electron-dev'], {
        shell: true,
        stdio: 'inherit'
    });

    electron.on('close', (code) => {
        vite.kill();
        process.exit(code);
    });
}).catch(err => {
    console.error(err);
    vite.kill();
    process.exit(1);
});
