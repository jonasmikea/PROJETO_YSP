const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const os = require('os');
const fs = require('fs');
const http = require('http');
const { spawn, execSync } = require('child_process');

let janelaPrincipal = null;
let processoDownloadAtivo = null;
const PORTA_SERVIDOR_MIDIA = 4545;
const ID_PLAYLIST_FAVORITOS = 'pl_favoritos';

// Configuração do autoUpdater
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function enviarStatusAtualizacao(tipo, dados = {}) {
  if (janelaPrincipal && !janelaPrincipal.isDestroyed()) {
    janelaPrincipal.webContents.send('status-atualizacao', { tipo, ...dados });
  }
}

autoUpdater.on('checking-for-update', () => { enviarStatusAtualizacao('checando'); });
autoUpdater.on('update-available', (info) => { enviarStatusAtualizacao('disponivel', { versao: info.version }); });
autoUpdater.on('update-not-available', (info) => { enviarStatusAtualizacao('indisponivel', { versao: info.version }); });
autoUpdater.on('error', (erro) => { enviarStatusAtualizacao('erro', { mensagem: erro.message }); });
autoUpdater.on('download-progress', (progresso) => {
  enviarStatusAtualizacao('baixando', {
    porcentagem: Math.round(progresso.percent),
    velocidade: Math.round(progresso.bytesPerSecond / 1024),
    transferido: Math.round(progresso.transferred / (1024 * 1024)),
    total: Math.round(progresso.total / (1024 * 1024))
  });
});
autoUpdater.on('update-downloaded', (info) => { enviarStatusAtualizacao('concluido', { versao: info.version }); });

function obterPastaPadrao() {
  return path.join(os.homedir(), 'Downloads', 'YSP');
}

function obterCaminhoConfig() {
  return path.join(os.homedir(), 'Downloads', 'YSP', 'config.json');
}

function obterCaminhoPlaylists() {
  return path.join(obterPastaConfigurada(), 'playlists.json');
}

function lerConfiguracoesDoDisco() {
  const caminho = obterCaminhoConfig();
  const padrao = {
    pastaDownload: obterPastaPadrao(),
    qualidadeAudio: '192'
  };

  try {
    if (fs.existsSync(caminho)) {
      const dados = JSON.parse(fs.readFileSync(caminho, 'utf-8'));
      return { ...padrao, ...dados };
    }
  } catch (e) {
    console.error("Erro ao ler config:", e);
  }
  return padrao;
}

function salvarConfiguracoesNoDisco(novasConfiguracoes) {
  const pastaBase = obterPastaPadrao();
  if (!fs.existsSync(pastaBase)) fs.mkdirSync(pastaBase, { recursive: true });
  const caminho = obterCaminhoConfig();
  fs.writeFileSync(caminho, JSON.stringify(novasConfiguracoes, null, 2), 'utf-8');
}

function obterPastaConfigurada() {
  const conf = lerConfiguracoesDoDisco();
  return conf.pastaDownload || obterPastaPadrao();
}

function normalizarNome(texto) {
  return (texto || '')
    .toLowerCase()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function garantirPlaylistFavoritos(playlists) {
  let fav = playlists.find(p => p.id === ID_PLAYLIST_FAVORITOS);
  if (!fav) {
    fav = {
      id: ID_PLAYLIST_FAVORITOS,
      nome: 'Músicas Favoritas',
      dataCriacao: new Date().toISOString(),
      itens: []
    };
    playlists.unshift(fav);
  }
  return playlists;
}

function lerPlaylistsDoDisco() {
  const caminho = obterCaminhoPlaylists();
  try {
    if (fs.existsSync(caminho)) {
      const conteudo = fs.readFileSync(caminho, 'utf-8');
      const parsed = JSON.parse(conteudo);
      return garantirPlaylistFavoritos(Array.isArray(parsed) ? parsed : []);
    }
  } catch (e) {
    console.error("Erro ao ler playlists:", e);
  }
  const listaPadrao = garantirPlaylistFavoritos([]);
  gravarPlaylistsNoDisco(listaPadrao);
  return listaPadrao;
}

function gravarPlaylistsNoDisco(playlists) {
  const pasta = obterPastaConfigurada();
  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });
  const caminho = obterCaminhoPlaylists();
  fs.writeFileSync(caminho, JSON.stringify(playlists, null, 2), 'utf-8');
}

function iniciarServidorMidiaLocal() {
  const servidor = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      const urlRequisicao = new URL(req.url, `http://127.0.0.1:${PORTA_SERVIDOR_MIDIA}`);
      const caminhoArquivo = urlRequisicao.searchParams.get('caminho');

      if (!caminhoArquivo || !fs.existsSync(caminhoArquivo)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Arquivo nao encontrado.');
        return;
      }

      const estatisticas = fs.statSync(caminhoArquivo);
      const tamanhoTotal = estatisticas.size;
      const range = req.headers.range;
      const extensao = path.extname(caminhoArquivo).toLowerCase();

      let tipoConteudo = 'application/octet-stream';
      if (extensao === '.mp4') tipoConteudo = 'video/mp4';
      else if (extensao === '.mp3') tipoConteudo = 'audio/mpeg';
      else if (extensao === '.jpg' || extensao === '.jpeg') tipoConteudo = 'image/jpeg';
      else if (extensao === '.webp') tipoConteudo = 'image/webp';
      else if (extensao === '.png') tipoConteudo = 'image/png';

      if (range) {
        const partes = range.replace(/bytes=/, "").split("-");
        const inicio = parseInt(partes[0], 10);
        const fim = partes[1] ? parseInt(partes[1], 10) : tamanhoTotal - 1;
        const tamanhoChunk = (fim - inicio) + 1;

        res.writeHead(206, {
          'Content-Range': `bytes ${inicio}-${fim}/${tamanhoTotal}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': tamanhoChunk,
          'Content-Type': tipoConteudo,
        });

        const streamLeitura = fs.createReadStream(caminhoArquivo, { start: inicio, end: fim });
        streamLeitura.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': tamanhoTotal,
          'Accept-Ranges': 'bytes',
          'Content-Type': tipoConteudo,
        });
        fs.createReadStream(caminhoArquivo).pipe(res);
      }
    } catch (erro) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Erro ao processar stream: ${erro.message}`);
    }
  });

  servidor.listen(PORTA_SERVIDOR_MIDIA, '127.0.0.1');
}

function criarJanela() {
  janelaPrincipal = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 650,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (app.isPackaged) {
    janelaPrincipal.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    janelaPrincipal.loadURL('http://localhost:5173');
  }
}

function obterComandoPython() {
  return process.env.LOCALAPPDATA 
    ? path.join(process.env.LOCALAPPDATA, 'Programs', 'Python', 'Python314', 'python.exe')
    : 'python';
}

// RESOLUÇÃO DO ERRO ASAR: Localiza o script em resources em produção e em __dirname em desenvolvimento
function obterCaminhoScript(nomeScript) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, nomeScript);
  }
  return path.join(__dirname, nomeScript);
}

ipcMain.handle('extrair-metadados', async (evento, urlAlvo) => {
  return new Promise((resolve) => {
    const caminhoScript = obterCaminhoScript('motor_busca.py');
    const processoPython = spawn(obterComandoPython(), [caminhoScript, `"${urlAlvo}"`], { shell: true });

    let dadosSaida = '';
    let dadosErro = '';

    processoPython.stdout.on('data', (dado) => { dadosSaida += dado.toString(); });
    processoPython.stderr.on('data', (dado) => { dadosErro += dado.toString(); });

    processoPython.on('error', (erroExecucao) => {
      resolve({ sucesso: false, erro: `Falha ao iniciar o Python: ${erroExecucao.message}` });
    });

    processoPython.on('close', (codigo) => {
      if (codigo !== 0) {
        resolve({ sucesso: false, erro: dadosErro || `Processo falhou com código ${codigo}` });
        return;
      }
      try {
        resolve(JSON.parse(dadosSaida.trim()));
      } catch {
        resolve({ sucesso: false, erro: 'Falha ao interpretar dados retornados.' });
      }
    });
  });
});

ipcMain.on('iniciar-download', (evento, { itens, formato, pastaDestino, qualidadeAudio }) => {
  const caminhoScript = obterCaminhoScript('motor_download.py');
  const conf = lerConfiguracoesDoDisco();
  const pastaFinal = pastaDestino || conf.pastaDownload || obterPastaPadrao();
  const qualidadeFinal = qualidadeAudio || conf.qualidadeAudio || '192';
  
  const argumentosJson = JSON.stringify(itens);

  processoDownloadAtivo = spawn(obterComandoPython(), [
    caminhoScript,
    `"${argumentosJson.replace(/"/g, '\\"')}"`,
    formato,
    `"${pastaFinal}"`,
    `"${qualidadeFinal}"`
  ], { shell: true });

  let bufferResidual = '';

  processoDownloadAtivo.stdout.on('data', (dadoBruto) => {
    bufferResidual += dadoBruto.toString();
    const linhas = bufferResidual.split('\n');
    bufferResidual = linhas.pop();

    for (const linha of linhas) {
      if (linha.includes('__EVENTO_YSP__')) {
        const jsonPuro = linha.replace('__EVENTO_YSP__', '').trim();
        try {
          const eventoObj = JSON.parse(jsonPuro);
          if (janelaPrincipal && !janelaPrincipal.isDestroyed()) {
            janelaPrincipal.webContents.send('progresso-download', eventoObj);
          }
        } catch {}
      }
    }
  });

  processoDownloadAtivo.on('close', () => {
    processoDownloadAtivo = null;
  });
});

ipcMain.on('cancelar-download', () => {
  if (processoDownloadAtivo) {
    processoDownloadAtivo.kill();
    processoDownloadAtivo = null;
  }
});

ipcMain.handle('ler-biblioteca-local', async () => {
  const pasta = obterPastaConfigurada();
  const pastaCapas = path.join(pasta, 'capas');

  try {
    if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });
    if (!fs.existsSync(pastaCapas)) fs.mkdirSync(pastaCapas, { recursive: true });

    const arquivos = fs.readdirSync(pasta);
    const arquivosCapas = fs.readdirSync(pastaCapas);
    const listaMidias = [];

    for (let index = 0; index < arquivos.length; index++) {
      const nomeArquivo = arquivos[index];
      const extensao = path.extname(nomeArquivo).toLowerCase();

      if (extensao === '.mp3' || extensao === '.mp4') {
        const caminhoCompleto = path.join(pasta, nomeArquivo);
        const estatisticas = fs.statSync(caminhoCompleto);
        const nomeSemExtensao = path.basename(nomeArquivo, extensao);

        let artista = 'Desconhecido';
        let titulo = nomeSemExtensao;
        if (nomeSemExtensao.includes(' - ')) {
          const partes = nomeSemExtensao.split(' - ');
          artista = partes[0].trim();
          titulo = partes.slice(1).join(' - ').trim();
        }

        let urlCapa = '';
        const nomeNormMidia = normalizarNome(nomeSemExtensao);

        for (const arquivoCapa of arquivosCapas) {
          const nomeCapaSemExt = path.basename(arquivoCapa, path.extname(arquivoCapa));
          const nomeNormCapa = normalizarNome(nomeCapaSemExt);

          if (nomeSemExtensao === nomeCapaSemExt || nomeNormMidia === nomeNormCapa || nomeNormMidia.includes(nomeNormCapa) || nomeNormCapa.includes(nomeNormMidia)) {
            const caminhoFinalCapa = path.join(pastaCapas, arquivoCapa);
            urlCapa = `http://127.0.0.1:${PORTA_SERVIDOR_MIDIA}/stream?caminho=${encodeURIComponent(caminhoFinalCapa)}`;
            break;
          }
        }

        if (!urlCapa && extensao === '.mp3') {
          const destinoExtraido = path.join(pastaCapas, `${nomeSemExtensao}.jpg`);
          try {
            execSync(`ffmpeg -y -i "${caminhoCompleto}" -an -vcodec copy "${destinoExtraido}"`, { stdio: 'ignore' });
            if (fs.existsSync(destinoExtraido)) {
              urlCapa = `http://127.0.0.1:${PORTA_SERVIDOR_MIDIA}/stream?caminho=${encodeURIComponent(destinoExtraido)}`;
            }
          } catch {}
        }

        const urlStreaming = `http://127.0.0.1:${PORTA_SERVIDOR_MIDIA}/stream?caminho=${encodeURIComponent(caminhoCompleto)}`;

        listaMidias.push({
          id: index + 1,
          caminhoOriginal: caminhoCompleto,
          titulo: titulo,
          artista: artista,
          caminhoArquivo: caminhoCompleto,
          urlAudio: urlStreaming,
          capa: urlCapa,
          formato: extensao.replace('.', ''),
          tamanhoBytes: estatisticas.size,
          dataModificacao: estatisticas.mtime
        });
      }
    }

    return { sucesso: true, musicas: listaMidias };
  } catch (erro) {
    return { sucesso: false, erro: erro.message, musicas: [] };
  }
});

ipcMain.handle('abrir-no-explorador', async (evento, caminhoArquivo) => {
  try {
    if (fs.existsSync(caminhoArquivo)) {
      shell.showItemInFolder(caminhoArquivo);
      return { sucesso: true };
    }
    return { sucesso: false, erro: 'Arquivo não encontrado no disco.' };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
});

ipcMain.handle('excluir-midia-disco', async (evento, caminhoArquivo) => {
  try {
    if (fs.existsSync(caminhoArquivo)) {
      fs.unlinkSync(caminhoArquivo);

      const pastaMidia = path.dirname(caminhoArquivo);
      const nomeSemExt = path.basename(caminhoArquivo, path.extname(caminhoArquivo));
      const pastaCapas = path.join(pastaMidia, 'capas');
      
      if (fs.existsSync(pastaCapas)) {
        for (const ext of ['.jpg', '.jpeg', '.webp', '.png']) {
          const arqCapa = path.join(pastaCapas, `${nomeSemExt}${ext}`);
          if (fs.existsSync(arqCapa)) {
            try { fs.unlinkSync(arqCapa); } catch {}
          }
        }
      }

      const playlists = lerPlaylistsDoDisco();
      let alterouPlaylists = false;
      playlists.forEach(pl => {
        const idx = pl.itens.indexOf(caminhoArquivo);
        if (idx !== -1) {
          pl.itens.splice(idx, 1);
          alterouPlaylists = true;
        }
      });
      if (alterouPlaylists) {
        gravarPlaylistsNoDisco(playlists);
      }

      return { sucesso: true };
    }
    return { sucesso: false, erro: 'Arquivo inexistente.' };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
});

// Configurações
ipcMain.handle('obter-configuracoes', async () => {
  return { sucesso: true, configuracoes: lerConfiguracoesDoDisco() };
});

ipcMain.handle('salvar-configuracoes', async (evento, novasConfig) => {
  try {
    salvarConfiguracoesNoDisco(novasConfig);
    return { sucesso: true, configuracoes: lerConfiguracoesDoDisco() };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
});

ipcMain.handle('selecionar-pasta-dialogo', async () => {
  const resultado = await dialog.showOpenDialog(janelaPrincipal, {
    title: 'Selecione a pasta de download do YSP',
    properties: ['openDirectory', 'createDirectory']
  });

  if (!resultado.canceled && resultado.filePaths.length > 0) {
    return { sucesso: true, caminho: resultado.filePaths[0] };
  }
  return { sucesso: false, cancelado: true };
});

// Playlists e Favoritos
ipcMain.handle('obter-playlists', async () => {
  try {
    return { sucesso: true, playlists: lerPlaylistsDoDisco() };
  } catch (erro) {
    return { sucesso: false, erro: erro.message, playlists: [] };
  }
});

ipcMain.handle('criar-playlist', async (evento, parametros) => {
  try {
    const nomeRecebido = typeof parametros === 'string' ? parametros : (parametros && parametros.nome);
    const itensRecebidos = (parametros && Array.isArray(parametros.itens)) ? parametros.itens : [];

    const playlists = lerPlaylistsDoDisco();
    const novaPlaylist = {
      id: 'pl_' + Date.now(),
      nome: (nomeRecebido || '').trim() || 'Nova Playlist',
      dataCriacao: new Date().toISOString(),
      itens: itensRecebidos
    };

    playlists.push(novaPlaylist);
    gravarPlaylistsNoDisco(playlists);
    return { sucesso: true, playlists };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
});

ipcMain.handle('excluir-playlist', async (evento, idPlaylist) => {
  try {
    if (idPlaylist === ID_PLAYLIST_FAVORITOS) {
      return { sucesso: false, erro: 'A playlist de Favoritos é padrão do sistema e não pode ser excluída.' };
    }
    let playlists = lerPlaylistsDoDisco();
    playlists = playlists.filter(p => p.id !== idPlaylist);
    gravarPlaylistsNoDisco(playlists);
    return { sucesso: true, playlists };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
});

ipcMain.handle('alternar-item-playlist', async (evento, parametros) => {
  try {
    const { idPlaylist, caminhoArquivo } = parametros || {};
    const playlists = lerPlaylistsDoDisco();
    const alvo = playlists.find(p => p.id === idPlaylist);
    if (alvo) {
      const indice = alvo.itens.indexOf(caminhoArquivo);
      if (indice === -1) {
        alvo.itens.push(caminhoArquivo);
      } else {
        alvo.itens.splice(indice, 1);
      }
      gravarPlaylistsNoDisco(playlists);
      return { sucesso: true, playlists };
    }
    return { sucesso: false, erro: 'Playlist não encontrada.' };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
});

ipcMain.handle('alternar-favorito', async (evento, caminhoArquivo) => {
  try {
    const playlists = lerPlaylistsDoDisco();
    const fav = playlists.find(p => p.id === ID_PLAYLIST_FAVORITOS);
    let favoritado = false;
    if (fav) {
      const idx = fav.itens.indexOf(caminhoArquivo);
      if (idx === -1) {
        fav.itens.push(caminhoArquivo);
        favoritado = true;
      } else {
        fav.itens.splice(idx, 1);
        favoritado = false;
      }
      gravarPlaylistsNoDisco(playlists);
      return { sucesso: true, favoritado, playlists };
    }
    return { sucesso: false, erro: 'Playlist de favoritos não localizada.' };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
});

// Auto-Update
ipcMain.handle('verificar-atualizacao', async () => {
  if (!app.isPackaged) {
    return { sucesso: false, erro: 'Atualizações automáticas funcionam apenas no app compilado (.exe).' };
  }
  try {
    const resultado = await autoUpdater.checkForUpdates();
    return { sucesso: true, resultado };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
});

ipcMain.handle('instalar-atualizacao-agora', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('obter-versao-app', () => {
  return app.getVersion();
});

app.whenReady().then(() => {
  iniciarServidorMidiaLocal();
  criarJanela();

  if (app.isPackaged) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(() => {});
    }, 3000);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});