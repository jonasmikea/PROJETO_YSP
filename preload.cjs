const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('apiElectron', {
  extrairMetadados: (url) => ipcRenderer.invoke('extrair-metadados', url),
  iniciarDownload: (dados) => ipcRenderer.send('iniciar-download', dados),
  cancelarDownload: () => ipcRenderer.send('cancelar-download'),
  lerBibliotecaLocal: () => ipcRenderer.invoke('ler-biblioteca-local'),
  
  // Ações de Arquivo
  abrirNoExplorador: (caminho) => ipcRenderer.invoke('abrir-no-explorador', caminho),
  excluirMidiaDisco: (caminho) => ipcRenderer.invoke('excluir-midia-disco', caminho),

  // Playlists e Favoritos
  obterPlaylists: () => ipcRenderer.invoke('obter-playlists'),
  criarPlaylist: (dados) => ipcRenderer.invoke('criar-playlist', dados),
  excluirPlaylist: (id) => ipcRenderer.invoke('excluir-playlist', id),
  alternarItemPlaylist: (dados) => ipcRenderer.invoke('alternar-item-playlist', dados),
  alternarFavorito: (caminho) => ipcRenderer.invoke('alternar-favorito', caminho),
  
  // Configurações
  obterConfiguracoes: () => ipcRenderer.invoke('obter-configuracoes'),
  salvarConfiguracoes: (dados) => ipcRenderer.invoke('salvar-configuracoes', dados),
  selecionarPastaDialogo: () => ipcRenderer.invoke('selecionar-pasta-dialogo'),

  // Atualização Automática
  verificarAtualizacao: () => ipcRenderer.invoke('verificar-atualizacao'),
  instalarAtualizacaoAgora: () => ipcRenderer.invoke('instalar-atualizacao-agora'),
  obterVersaoApp: () => ipcRenderer.invoke('obter-versao-app'),
  aoReceberStatusAtualizacao: (callback) => {
    ipcRenderer.removeAllListeners('status-atualizacao');
    ipcRenderer.on('status-atualizacao', (evento, dados) => callback(dados));
  },

  aoReceberProgresso: (callback) => {
    ipcRenderer.removeAllListeners('progresso-download');
    ipcRenderer.on('progresso-download', (evento, dados) => callback(dados));
  }
});