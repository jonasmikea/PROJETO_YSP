const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function criarJanela() {
  const janela = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 650,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  janela.loadURL('http://localhost:5173');
}

// Canal IPC para extrair metadados chamando o Python
ipcMain.handle('extrair-metadados', async (evento, urlAlvo) => {
  return new Promise((resolve) => {
    const caminhoScript = path.join(__dirname, 'motor_busca.py');
    const processoPython = spawn('python', [caminhoScript, urlAlvo]);

    let dadosSaida = '';
    let dadosErro = '';

    processoPython.stdout.on('data', (dado) => {
      dadosSaida += dado.toString();
    });

    processoPython.stderr.on('data', (dado) => {
      dadosErro += dado.toString();
    });

    processoPython.on('close', (codigo) => {
      if (codigo !== 0) {
        resolve({ sucesso: false, erro: dadosErro || `Processo falhou com código ${codigo}` });
        return;
      }

      try {
        const resultadoJson = JSON.parse(dadosSaida.trim());
        resolve(resultadoJson);
      } catch (erroParse) {
        resolve({ sucesso: false, erro: 'Falha ao processar os dados retornados pelo motor.' });
      }
    });
  });
});

app.whenReady().then(criarJanela);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});