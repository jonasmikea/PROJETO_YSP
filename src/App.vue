<template>
  <div 
    class="aplicativo-container" 
    @keydown.esc="fecharReprodutores" 
    @keydown.f="alternarTelaCheiaVideo" 
    @click="fecharMenuCardAberto"
    tabindex="0"
  >
    <!-- 0. BARRA LATERAL EM CÁPSULA GLOBAL (TABLER ICONS) -->
    <aside class="capsula-sidebar">
      <!-- Icon: tabler-home -->
      <button 
        :class="['btn-capsula', { ativo: telaAtual === 'inicio' }]" 
        @click="irPara('inicio')" 
        title="Início"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
          <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
        </svg>
      </button>

      <!-- Icon: tabler-music -->
      <button 
        :class="['btn-capsula', { ativo: telaAtual === 'player' }]" 
        @click="abrirPlayer" 
        title="Biblioteca Geral"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          <path d="M9 17v-13h10v13" />
          <path d="M9 8h10" />
        </svg>
      </button>

      <!-- Icon: tabler-playlist -->
      <button 
        :class="['btn-capsula', { ativo: telaAtual === 'playlists' || telaAtual === 'playlist_detalhe' }]" 
        @click="irPara('playlists')" 
        title="Playlists"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          <path d="M17 17v-13h4" />
          <path d="M13 5h-10" />
          <path d="M3 9h10" />
          <path d="M9 13h-6" />
        </svg>
      </button>

      <!-- Icon: tabler-download -->
      <button 
        :class="['btn-capsula', { ativo: telaAtual.startsWith('downloader') }]" 
        @click="irPara('downloader_busca')" 
        title="Transferir Mídias"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
          <path d="M7 11l5 5l5 -5" />
          <path d="M12 4l0 12" />
        </svg>
      </button>

      <!-- Icon: tabler-refresh -->
      <button 
        class="btn-capsula" 
        @click="carregarMidiasLocais" 
        title="Atualizar Mídias"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
        </svg>
      </button>

      <!-- Icon: tabler-settings -->
      <button 
        class="btn-capsula" 
        @click="alternarModalConfiguracoes" 
        title="Configurações" 
        style="margin-top: auto;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>
      </button>
    </aside>

    <!-- ÁREA DE CONTEÚDO CENTRAL GLOBAL -->
    <section class="area-conteudo-central">
      <!-- 1. TELA INICIAL (Hub) -->
      <main v-if="telaAtual === 'inicio'" class="tela-downloader-moderna">
        <div class="caixa-logo-ysp">
          <img v-if="temLogoArquivo" :src="urlLogo" alt="You Save Play Logo" @error="temLogoArquivo = false" />
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="var(--destaque-laranja)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 18px var(--destaque-laranja));">
            <path d="M7 4v16l13 -8z" fill="rgba(255, 71, 38, 0.2)" />
            <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          </svg>
        </div>

        <div class="textos-apresentacao-downloader">
          <h1>YOU SAVE PLAY</h1>
          <p>O seu centro elegante de download e reprodução de mídias.</p>
        </div>

        <div style="display: flex; gap: 16px; margin-top: 10px;">
          <button class="botao-neu botao-laranja" @click="irPara('downloader_busca')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 11l5 5l5 -5" />
              <path d="M12 4l0 12" />
            </svg>
            Baixar Mídias
          </button>
          <button class="botao-neu" @click="abrirPlayer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" />
              <path d="M15 15m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" />
              <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
            </svg>
            Reprodutor
          </button>
          <button class="botao-neu" @click="irPara('playlists')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M17 17v-13h4" />
              <path d="M13 5h-10" />
              <path d="M3 9h10" />
              <path d="M9 13h-6" />
            </svg>
            Playlists
          </button>
        </div>
      </main>

      <!-- 2. TELA DOWNLOADER -->
      <main v-else-if="telaAtual === 'downloader_busca'" class="tela-downloader-moderna">
        <div class="caixa-logo-ysp">
          <img v-if="temLogoArquivo" :src="urlLogo" alt="You Save Play Logo" @error="temLogoArquivo = false" />
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="var(--destaque-laranja)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 18px var(--destaque-laranja));">
            <path d="M7 4v16l13 -8z" fill="rgba(255, 71, 38, 0.2)" />
            <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          </svg>
        </div>

        <div class="textos-apresentacao-downloader">
          <h1>Baixe vídeos e músicas do YouTube</h1>
          <p>Cole o link abaixo para baixar ou reproduzir diretamente.</p>
        </div>

        <div class="barra-downloader-pilula">
          <span class="icone-link-pesquisa">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 15l6 -6" />
              <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
              <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
            </svg>
          </span>

          <input 
            type="text" 
            v-model="urlEntrada" 
            :disabled="buscando"
            placeholder="Cole aqui o link do YouTube..." 
            class="input-downloader-moderno"
            @keyup.enter="processarBusca"
          />

          <button 
            v-if="urlEntrada" 
            class="btn-limpar-campo" 
            @click="urlEntrada = ''" 
            title="Limpar link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>

          <button 
            class="btn-pesquisar-retangular" 
            @click="processarBusca" 
            :disabled="buscando"
            title="Buscar"
          >
            <span v-if="!buscando">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
            </span>
            <span v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                <path d="M12 3a9 9 0 1 0 9 9" />
              </svg>
            </span>
          </button>
        </div>

        <div class="seletor-formato-pilulas">
          <button 
            :class="['btn-pilula-formato', { ativo: formatoEscolhido === 'audio' }]" 
            @click="formatoEscolhido = 'audio'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M9 17v-13h10v13" />
              <path d="M9 8h10" />
            </svg>
            Música (MP3)
          </button>

          <button 
            :class="['btn-pilula-formato', { ativo: formatoEscolhido === 'video' }]" 
            @click="formatoEscolhido = 'video'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
              <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
            </svg>
            Vídeo (MP4)
          </button>
        </div>

        <p v-if="buscando" style="color: var(--destaque-laranja); font-size: 13px; margin-top: 6px;">
          Extraindo informações do link via yt-dlp...
        </p>
      </main>

      <!-- 3. TELA DOWNLOADER: RESULTADOS -->
      <main v-else-if="telaAtual === 'downloader_resultados'" class="tela-resultados">
        <div class="barra-ferramentas-resultados">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" v-model="selecionarTodos" @change="alternarTodos" />
            <span>Selecionar Todos ({{ listaResultados.length }})</span>
          </label>

          <div class="seletor-formato-pilulas" style="margin-top: 0;">
            <button 
              :class="['btn-pilula-formato', { ativo: formatoEscolhido === 'audio' }]" 
              @click="formatoEscolhido = 'audio'"
            >
              Música (MP3)
            </button>
            <button 
              :class="['btn-pilula-formato', { ativo: formatoEscolhido === 'video' }]" 
              @click="formatoEscolhido = 'video'"
            >
              Vídeo (MP4)
            </button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; max-height: 480px; overflow-y: auto; padding-right: 6px;">
          <div v-for="item in listaResultados" :key="item.id" class="card-item-download">
            <input type="checkbox" v-model="item.selecionado" style="cursor: pointer; width: 18px; height: 18px;" />
            
            <img 
              :src="item.thumbnail" 
              alt="Miniatura" 
              style="width: 80px; height: 50px; object-fit: cover; border-radius: 10px; border: 1px solid var(--borda-sutil);" 
              @error="$event.target.style.display='none'"
            />

            <div class="info-resultado">
              <span class="titulo-midia">{{ item.titulo }}</span>
              <span class="duracao-midia">Duração: {{ item.duracao }}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 16px; margin-top: 10px;">
          <button class="botao-neu" @click="irPara('downloader_busca')">Nova Busca</button>
          <button class="botao-neu botao-laranja" @click="iniciarFilaDownload">
            Baixar Selecionados ({{ listaResultados.filter(i => i.selecionado).length }})
          </button>
        </div>
      </main>

      <!-- 4. TELA DOWNLOADER: FILA E PROGRESSO EM TEMPO REAL -->
      <main v-else-if="telaAtual === 'downloader_fila'" class="tela-resultados">
        <div class="painel-neu" style="padding: 20px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <h3 style="font-size: 18px; font-weight: 700;">Progresso dos Downloads</h3>
              <span style="font-size: 13px; color: var(--texto-secundario);">
                Formato: <strong>{{ formatoEscolhido.toUpperCase() }}</strong> • Concluídos: {{ totalConcluidos }} de {{ itensParaBaixar.length }}
              </span>
            </div>
            <span style="font-size: 14px; font-weight: 700; color: var(--destaque-laranja);">
              {{ progressoGeral }}%
            </span>
          </div>

          <div style="width: 100%; height: 8px; background: #141519; border-radius: 10px; overflow: hidden; box-shadow: inset 1px 1px 4px #000;">
            <div 
              style="height: 100%; background: var(--destaque-gradiente); transition: width 0.3s ease;"
              :style="{ width: progressoGeral + '%' }"
            ></div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; max-height: 400px; overflow-y: auto; padding-right: 6px;">
          <div v-for="item in itensParaBaixar" :key="item.id" class="card-item-download" style="flex-direction: column; align-items: stretch; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <img 
                :src="item.thumbnail" 
                alt="Miniatura" 
                style="width: 70px; height: 44px; object-fit: cover; border-radius: 8px; border: 1px solid var(--borda-sutil);" 
                @error="$event.target.style.display='none'"
              />
              <div style="flex: 1; min-width: 0;">
                <span class="titulo-midia" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.titulo }}</span>
                <span style="font-size: 12px; color: var(--texto-secundario);">{{ item.duracao }}</span>
              </div>
              
              <div style="text-align: right;">
                <span 
                  style="font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px;"
                  :style="obterEstiloBadge(item.status)"
                >
                  {{ item.statusTexto }}
                </span>
              </div>
            </div>

            <div style="width: 100%; height: 4px; background: #141519; border-radius: 6px; overflow: hidden;">
              <div 
                style="height: 100%; background: var(--destaque-laranja); transition: width 0.2s;"
                :style="{ width: (item.progresso || 0) + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <button class="botao-neu" @click="irPara('downloader_busca')">Nova Busca</button>
          <button class="botao-neu botao-laranja" @click="abrirPlayer">
            Ir para o Reprodutor
          </button>
        </div>
      </main>

      <!-- 5. TELA DO PLAYER: BIBLIOTECA (PHONOID) -->
      <main v-else-if="telaAtual === 'player'">
        <div class="topo-biblioteca">
          <h1 class="titulo-biblioteca">Library ({{ musicasFiltradas.length }})</h1>
          <div class="pesquisa-biblioteca">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--texto-secundario);">
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
            <input type="text" v-model="filtroBiblioteca" placeholder="Procurar na biblioteca..." />
          </div>
        </div>

        <div v-if="musicasFiltradas.length > 0">
          <section v-if="listaMusicas.length > 0" class="secao-biblioteca">
            <div class="cabecalho-secao">
              <h2 class="titulo-secao">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" />
                  <path d="M15 15m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" />
                  <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
                </svg>
                Músicas
              </h2>
              <span class="contador-secao">{{ listaMusicas.length }}</span>
            </div>

            <div class="grade-phonoid">
              <div 
                v-for="musica in listaMusicas" 
                :key="musica.id" 
                class="card-phonoid" 
                @click="tocarFaixa(musica)"
              >
                <div class="moldura-capa" :style="faixaAtiva && faixaAtiva.id === musica.id ? 'border-color: var(--destaque-laranja);' : ''">
                  <div class="emblema-tipo-midia" title="Áudio MP3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" />
                      <path d="M15 15m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" />
                      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
                    </svg>
                  </div>

                  <button 
                    class="btn-menu-card" 
                    @click.stop="alternarMenuCard(musica.id)" 
                    title="Opções"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                      <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                      <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    </svg>
                  </button>

                  <div 
                    v-if="cardMenuAbertoId === musica.id" 
                    class="menu-dropdown-card"
                    @click.stop
                  >
                    <button class="item-menu-dropdown" @click="abrirArquivoNoExplorador(musica.caminhoOriginal)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                      </svg>
                      Abrir no Explorador
                    </button>
                    <button class="item-menu-dropdown" @click="abrirModalGerenciarPlaylist(musica)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        <path d="M17 17v-13h4" />
                        <path d="M13 5h-10" />
                        <path d="M3 9h10" />
                        <path d="M9 13h-6" />
                      </svg>
                      Adicionar à Playlist
                    </button>
                    <button class="item-menu-dropdown perigo" @click="confirmarExcluirMidia(musica)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                      Excluir do Disco
                    </button>
                  </div>

                  <img 
                    v-if="musica.capa" 
                    :src="musica.capa" 
                    alt="Capa" 
                    style="width: 100%; height: 100%; object-fit: cover;"
                    @error="musica.capa = ''"
                  />
                  <div v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--texto-secundario);">
                      <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                      <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                      <path d="M9 17v-13h10v13" />
                      <path d="M9 8h10" />
                    </svg>
                  </div>
                </div>

                <div class="texto-card-phonoid">
                  <strong class="titulo-faixa-phonoid" :style="faixaAtiva && faixaAtiva.id === musica.id ? 'color: var(--destaque-laranja);' : ''">
                    {{ musica.titulo }}
                  </strong>
                  <span class="artista-faixa-phonoid">{{ musica.artista }}</span>
                </div>
              </div>
            </div>
          </section>

          <section v-if="listaVideos.length > 0" class="secao-biblioteca">
            <div class="cabecalho-secao">
              <h2 class="titulo-secao">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                  <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                </svg>
                Vídeos
              </h2>
              <span class="contador-secao">{{ listaVideos.length }}</span>
            </div>

            <div class="grade-phonoid">
              <div 
                v-for="video in listaVideos" 
                :key="video.id" 
                class="card-phonoid" 
                @click="tocarFaixa(video)"
              >
                <div class="moldura-capa" :style="faixaAtiva && faixaAtiva.id === video.id ? 'border-color: var(--destaque-laranja);' : ''">
                  <div class="emblema-tipo-midia" title="Vídeo MP4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                      <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                    </svg>
                  </div>

                  <button 
                    class="btn-menu-card" 
                    @click.stop="alternarMenuCard(video.id)" 
                    title="Opções"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                      <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                      <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    </svg>
                  </button>

                  <div 
                    v-if="cardMenuAbertoId === video.id" 
                    class="menu-dropdown-card"
                    @click.stop
                  >
                    <button class="item-menu-dropdown" @click="abrirArquivoNoExplorador(video.caminhoOriginal)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                      </svg>
                      Abrir no Explorador
                    </button>
                    <button class="item-menu-dropdown" @click="abrirModalGerenciarPlaylist(video)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        <path d="M17 17v-13h4" />
                        <path d="M13 5h-10" />
                        <path d="M3 9h10" />
                        <path d="M9 13h-6" />
                      </svg>
                      Adicionar à Playlist
                    </button>
                    <button class="item-menu-dropdown perigo" @click="confirmarExcluirMidia(video)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                      Excluir do Disco
                    </button>
                  </div>

                  <img 
                    v-if="video.capa" 
                    :src="video.capa" 
                    alt="Capa" 
                    style="width: 100%; height: 100%; object-fit: cover;"
                    @error="video.capa = ''"
                  />
                  <div v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--texto-secundario);">
                      <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                      <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                    </svg>
                  </div>
                </div>

                <div class="texto-card-phonoid">
                  <strong class="titulo-faixa-phonoid" :style="faixaAtiva && faixaAtiva.id === video.id ? 'color: var(--destaque-laranja);' : ''">
                    {{ video.titulo }}
                  </strong>
                  <span class="artista-faixa-phonoid">{{ video.artista }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div v-else style="text-align: center; margin-top: 60px; color: var(--texto-secundario);">
          <div style="font-size: 40px; margin-bottom: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
            </svg>
          </div>
          <p>Nenhuma mídia encontrada na pasta de transferências.</p>
          <button class="botao-neu botao-laranja" @click="irPara('downloader_busca')" style="margin-top: 16px;">
            Baixar Músicas Agora
          </button>
        </div>
      </main>

      <!-- 6. TELA DE PLAYLISTS -->
      <main v-else-if="telaAtual === 'playlists'">
        <div class="topo-biblioteca">
          <h1 class="titulo-biblioteca">Playlists ({{ listaPlaylists.length }})</h1>
          <button class="botao-neu botao-laranja" @click="abrirModalNovaPlaylist">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
            Criar Playlist
          </button>
        </div>

        <div v-if="listaPlaylists.length > 0" class="grade-phonoid">
          <div 
            v-for="pl in listaPlaylists" 
            :key="pl.id" 
            class="card-playlist-grade"
            @click="abrirDetalhePlaylist(pl)"
          >
            <div class="capa-mosaico-playlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--texto-secundario);">
                <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
              </svg>
            </div>
            <div>
              <strong style="font-size: 15px; display: block;">{{ pl.nome }}</strong>
              <span style="font-size: 12px; color: var(--texto-secundario);">
                {{ pl.itens.length }} {{ pl.itens.length === 1 ? 'mídia' : 'mídias' }}
              </span>
            </div>
          </div>
        </div>

        <div v-else style="text-align: center; margin-top: 60px; color: var(--texto-secundario);">
          <div style="font-size: 42px; margin-bottom: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M17 17v-13h4" />
              <path d="M13 5h-10" />
              <path d="M3 9h10" />
              <path d="M9 13h-6" />
            </svg>
          </div>
          <p>Você ainda não criou nenhuma playlist.</p>
          <button class="botao-neu botao-laranja" @click="abrirModalNovaPlaylist" style="margin-top: 16px;">
            Criar Minha Primeira Playlist
          </button>
        </div>
      </main>

      <!-- 7. TELA DE DETALHE DE UMA PLAYLIST -->
      <main v-else-if="telaAtual === 'playlist_detalhe' && playlistAtiva">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <button class="link-voltar" @click="irPara('playlists')" style="margin-bottom: 8px;">
              ← Voltar para Playlists
            </button>
            <h1 class="titulo-biblioteca">{{ playlistAtiva.nome }}</h1>
            <span style="font-size: 13px; color: var(--texto-secundario);">
              {{ itensDaPlaylistAtiva.length }} itens • Criada em {{ formatarData(playlistAtiva.dataCriacao) }}
            </span>
          </div>

          <div style="display: flex; gap: 12px;">
            <button 
              v-if="itensDaPlaylistAtiva.length > 0" 
              class="botao-neu botao-laranja" 
              @click="tocarFaixa(itensDaPlaylistAtiva[0])"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
              </svg>
              Tocar Tudo
            </button>
            <button class="botao-neu" @click="deletarPlaylistAtual(playlistAtiva.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 7l16 0" />
                <path d="M10 11l0 6" />
                <path d="M14 11l0 6" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
              Excluir Playlist
            </button>
          </div>
        </div>

        <div v-if="itensDaPlaylistAtiva.length > 0" class="grade-phonoid">
          <div 
            v-for="midia in itensDaPlaylistAtiva" 
            :key="midia.id" 
            class="card-phonoid"
            @click="tocarFaixa(midia)"
          >
            <div class="moldura-capa" :style="faixaAtiva && faixaAtiva.id === midia.id ? 'border-color: var(--destaque-laranja);' : ''">
              <div class="emblema-tipo-midia">
                <svg v-if="midia.formato === 'mp4'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                  <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                  <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                  <path d="M9 17v-13h10v13" />
                  <path d="M9 8h10" />
                </svg>
              </div>

              <button 
                class="btn-menu-card" 
                @click.stop="alternarMenuCard(midia.id)" 
                title="Opções"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                </svg>
              </button>

              <div 
                v-if="cardMenuAbertoId === midia.id" 
                class="menu-dropdown-card"
                @click.stop
              >
                <button class="item-menu-dropdown" @click="abrirArquivoNoExplorador(midia.caminhoOriginal)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                  </svg>
                  Abrir no Explorador
                </button>
                <button class="item-menu-dropdown" @click="removerMidiaDaPlaylist(playlistAtiva.id, midia.caminhoOriginal)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </svg>
                  Remover da Playlist
                </button>
                <button class="item-menu-dropdown perigo" @click="confirmarExcluirMidia(midia)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                  Excluir do Disco
                </button>
              </div>

              <img 
                v-if="midia.capa" 
                :src="midia.capa" 
                alt="Capa" 
                style="width: 100%; height: 100%; object-fit: cover;"
                @error="midia.capa = ''"
              />
              <div v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--texto-secundario);">
                  <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                  <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                  <path d="M9 17v-13h10v13" />
                  <path d="M9 8h10" />
                </svg>
              </div>
            </div>

            <div class="texto-card-phonoid">
              <strong class="titulo-faixa-phonoid" :style="faixaAtiva && faixaAtiva.id === midia.id ? 'color: var(--destaque-laranja);' : ''">
                {{ midia.titulo }}
              </strong>
              <span class="artista-faixa-phonoid">{{ midia.artista }}</span>
            </div>
          </div>
        </div>

        <div v-else style="text-align: center; margin-top: 60px; color: var(--texto-secundario);">
          <div style="font-size: 38px; margin-bottom: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M9 17v-13h10v13" />
              <path d="M9 8h10" />
            </svg>
          </div>
          <p>Esta playlist está vazia.</p>
          <button class="botao-neu" @click="irPara('player')" style="margin-top: 14px;">
            Ir à Biblioteca para Adicionar Faixas
          </button>
        </div>
      </main>
    </section>

    <!-- NOVO MINIPLAYER INFERIOR (100% TABLER ICONS) -->
    <footer class="dock-player-exato" v-if="faixaAtiva">
      <div class="bloco-esq-player">
        <div class="capa-mini-exata" @click="abrirModoExpandido" style="cursor: pointer;">
          <img 
            v-if="faixaAtiva && faixaAtiva.capa" 
            :src="faixaAtiva.capa" 
            alt="Capa" 
            @error="faixaAtiva.capa = ''"
          />
          <span v-else>
            <svg v-if="faixaAtiva.formato === 'mp4'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
              <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M9 17v-13h10v13" />
              <path d="M9 8h10" />
            </svg>
          </span>
        </div>

        <div class="info-mini-exata" @click="abrirModoExpandido" style="cursor: pointer;">
          <strong>{{ faixaAtiva ? faixaAtiva.titulo : 'Nenhuma faixa' }}</strong>
          <span>{{ faixaAtiva ? faixaAtiva.artista : 'Desconhecido' }}</span>
        </div>

        <!-- Icon: tabler-arrows-diagonal -->
        <button class="btn-icone-mini" @click="abrirModoExpandido" title="Expandir">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h4v4" />
            <path d="M14 10l6 -6" />
            <path d="M8 20h-4v-4" />
            <path d="M4 20l6 -6" />
          </svg>
        </button>

        <!-- Icon: tabler-heart -->
        <button class="btn-icone-mini" @click.stop title="Favoritar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
          </svg>
        </button>
      </div>

      <!-- Bloco Centro: Shuffle, Anterior, Play com Anel Neon, Próxima, Loop -->
      <div class="bloco-centro-player">
        <!-- Icon: tabler-arrows-shuffle -->
        <button class="btn-ctrl-acao" @click="alternarAleatorio" title="Aleatório">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 4l3 3l-3 3" />
            <path d="M18 20l3 -3l-3 -3" />
            <path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" />
            <path d="M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3" />
          </svg>
        </button>

        <!-- Icon: tabler-player-track-prev -->
        <button class="btn-ctrl-acao" @click="tocarAnterior" title="Anterior">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 5v14l-8 -7z" />
            <path d="M10 5v14l-8 -7z" />
          </svg>
        </button>

        <!-- Botão Play Anel Neon -->
        <button class="btn-play-anel-neon" @click="alternarPlayPause" title="Play/Pause">
          <svg v-if="!estaTocando" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
            <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
          </svg>
        </button>

        <!-- Icon: tabler-player-track-next -->
        <button class="btn-ctrl-acao" @click="tocarProxima" title="Próxima">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 5v14l8 -7z" />
            <path d="M14 5v14l8 -7z" />
          </svg>
        </button>

        <!-- Icon: tabler-repeat -->
        <button 
          :class="['btn-ctrl-acao', { 'ativo-cor': repetirFaixa }]" 
          @click="repetirFaixa = !repetirFaixa" 
          title="Repetir"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
            <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" />
          </svg>
        </button>
      </div>

      <!-- Bloco Direita: Volume, Barra Laranja, Contador Cápsula, Playlist e Fullscreen -->
      <div class="bloco-dir-player">
        <!-- Icon: tabler-volume / tabler-volume-off -->
        <button class="btn-icone-mini" @click="alternarMudo" title="Mudo">
          <svg v-if="volumeAtual > 0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 8a5 5 0 0 1 0 8" />
            <path d="M17.7 5a9 9 0 0 1 0 14" />
            <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
            <path d="M16 10l4 4m0 -4l-4 4" />
          </svg>
        </button>

        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          v-model.number="volumeAtual" 
          @input="ajustarVolume" 
          class="slider-volume-laranja" 
        />

        <div class="capsula-tempo-rebaixada">
          {{ formatarTempo(tempoSegundosAtual) }} / {{ formatarTempo(tempoSegundosTotal) }}
        </div>

        <!-- Icon: tabler-playlist -->
        <button class="btn-icone-mini" title="Fila de reprodução" @click="irPara('player')">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
            <path d="M17 17v-13h4" />
            <path d="M13 5h-10" />
            <path d="M3 9h10" />
            <path d="M9 13h-6" />
          </svg>
        </button>

        <!-- Icon: tabler-maximize -->
        <button class="btn-icone-mini" @click="abrirModoExpandido" title="Tela Cheia">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
            <path d="M4 16v2a2 2 0 0 0 2 2h2" />
            <path d="M16 4h2a2 2 0 0 1 2 2v2" />
            <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
          </svg>
        </button>
      </div>
    </footer>

    <!-- REPRODUTOR DE VÍDEO MP4 -->
    <div 
      v-show="exibirReprodutorVideo && faixaAtiva && faixaAtiva.formato === 'mp4'" 
      ref="containerVideoWindows"
      class="container-reprodutor-windows"
      :class="{ 'mouse-inativo': !controlesVisiveis && estaTocando }"
      @mousemove="aoMoverMouseVideo"
      @mouseleave="esconderControlesImediatamente"
      @dblclick="alternarTelaCheiaVideo"
    >
      <button 
        class="btn-voltar-topo-windows" 
        :class="{ 'oculta': !controlesVisiveis && estaTocando }"
        @click="fecharReprodutores"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
          <path d="M5 12l14 0" />
          <path d="M5 12l6 6" />
          <path d="M5 12l6 -6" />
        </svg>
        Voltar
      </button>

      <video 
        ref="referenciaVideo"
        class="video-windows-full"
        @timeupdate="aoAtualizarTempo"
        @loadedmetadata="aoCarregarMetadados"
        @ended="aoFinalizarFaixa"
        @error="aoOcorrerErroMidia"
        @click="alternarPlayPause"
      ></video>

      <div class="barra-windows-flutuante" :class="{ 'oculta': !controlesVisiveis && estaTocando }">
        <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; cursor: pointer;" @click.stop="navegarTempoVideo">
          <div :style="{ width: progressoPercentual + '%' }" style="height: 100%; background: var(--destaque-laranja); border-radius: 2px;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <span style="font-size: 13px; color: #d1d5db;">{{ formatarTempoWindows(tempoSegundosAtual) }}</span>
          <div style="display: flex; align-items: center; gap: 14px;">
            <button class="botao-neu" style="padding: 6px 12px; border-radius: 20px;" @click.stop="avancarRecuar(-10)">10⟲</button>
            <button class="btn-play-anel-neon" style="width: 44px; height: 44px;" @click.stop="alternarPlayPause">
              <svg v-if="!estaTocando" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
                <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
              </svg>
            </button>
            <button class="botao-neu" style="padding: 6px 12px; border-radius: 20px;" @click.stop="avancarRecuar(30)">⟳30</button>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 13px; color: #d1d5db;">{{ formatarTempoWindows(tempoSegundosTotal) }}</span>
            <button class="btn-ctrl-acao" @click.stop="alternarTelaCheiaVideo">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
                <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- REPRODUTOR DE ÁUDIO MP3 -->
    <div v-show="exibirReprodutorAudio && faixaAtiva && faixaAtiva.formato !== 'mp4'" class="modal-spotify-audio">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="botao-neu" @click="fecharReprodutores" style="padding: 8px 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
            <path d="M6 9l6 6l6 -6" />
          </svg>
          Minimizar
        </button>
        <span style="font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: var(--texto-secundario);">
          TOCANDO AGORA • ÁUDIO MP3
        </span>
        <div style="width: 80px;"></div>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 24px;">
        <div :class="['disco-giratorio', { pausado: !estaTocando }]">
          <img 
            v-if="faixaAtiva && faixaAtiva.capa" 
            :src="faixaAtiva.capa" 
            alt="Capa Vinil" 
            style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #ff4726;" 
            @error="faixaAtiva.capa = ''"
          />
          <div v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M9 17v-13h10v13" />
              <path d="M9 8h10" />
            </svg>
          </div>
        </div>
        <div style="text-align: center;">
          <h2 style="font-size: 24px; font-weight: 800;">{{ faixaAtiva ? faixaAtiva.titulo : '' }}</h2>
          <p style="font-size: 15px; color: var(--texto-secundario); margin-top: 4px;">{{ faixaAtiva ? faixaAtiva.artista : '' }}</p>
        </div>
      </div>

      <div style="width: 100%; max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px;">
        <div style="width: 100%; height: 4px; background: #282a30; border-radius: 2px; cursor: pointer;" @click="navegarTempoAudio">
          <div :style="{ width: progressoPercentual + '%' }" style="height: 100%; background: var(--destaque-laranja); border-radius: 2px;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: var(--texto-secundario);">{{ formatarTempo(tempoSegundosAtual) }}</span>
          <div style="display: flex; align-items: center; gap: 20px;">
            <button class="botao-neu" style="border-radius: 50%; width: 44px; height: 44px; padding: 0;" @click="tocarAnterior">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 5v14l-8 -7z" />
                <path d="M10 5v14l-8 -7z" />
              </svg>
            </button>
            <button class="botao-neu" style="border-radius: 50%; width: 40px; height: 40px; padding: 0;" @click="avancarRecuar(-10)">
              10⟲
            </button>
            <button class="btn-play-anel-neon" style="width: 54px; height: 54px;" @click="alternarPlayPause">
              <svg v-if="!estaTocando" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
                <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
              </svg>
            </button>
            <button class="botao-neu" style="border-radius: 50%; width: 40px; height: 40px; padding: 0;" @click="avancarRecuar(10)">
              ⟳10
            </button>
            <button class="botao-neu" style="border-radius: 50%; width: 44px; height: 44px; padding: 0;" @click="tocarProxima">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 5v14l8 -7z" />
                <path d="M14 5v14l8 -7z" />
              </svg>
            </button>
          </div>
          <span style="font-size: 12px; color: var(--texto-secundario);">{{ formatarTempo(tempoSegundosTotal) }}</span>
        </div>
      </div>
    </div>

    <!-- MODAIS MONTADOS COM TELEPORT NO BODY -->
    <Teleport to="body">
      <!-- 1. MODAL CRIAR PLAYLIST COM SELEÇÃO DE TODAS AS MÍDIAS -->
      <div 
        v-if="exibirModalCriarPlaylist" 
        class="modal-overlay" 
        @click.self="exibirModalCriarPlaylist = false"
      >
        <div class="card-configuracoes-neu" style="width: 580px; max-height: 85vh; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 20px; font-weight: 700;">Nova Playlist</h3>
            <span style="font-size: 12px; color: var(--texto-secundario);">
              {{ itensSelecionadosParaNovaPlaylist.length }} selecionados
            </span>
          </div>

          <div>
            <label style="font-size: 12px; color: var(--texto-secundario); display: block; margin-bottom: 6px;">Nome da Playlist:</label>
            <input 
              type="text" 
              v-model="nomeNovaPlaylist" 
              placeholder="Ex: Favoritas, Treino, Animes..." 
              class="input-downloader-moderno" 
              style="background: var(--bg-profundo); border-radius: 14px; width: 100%; padding: 10px 14px; border: 1px solid var(--borda-sutil);" 
              @keyup.enter="confirmarCriarPlaylist" 
            />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 4px;">
            <input 
              type="text" 
              v-model="termoBuscaModalPlaylist" 
              placeholder="Filtrar faixas por título ou artista..." 
              class="input-downloader-moderno" 
              style="background: var(--bg-profundo); border-radius: 12px; padding: 8px 14px; font-size: 13px; flex: 1; border: 1px solid var(--borda-sutil);" 
            />
            <button class="btn-limpar-campo" style="font-size: 12px;" @click="alternarSelecionarTodasMidiasModal">
              {{ todosSelecionadosNoModal ? 'Desmarcar Todas' : 'Selecionar Todas' }}
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; overflow-y: auto; flex: 1; padding-right: 4px; margin-top: 6px; max-height: 320px;">
            <div 
              v-for="midia in midiasFiltradasParaModal" 
              :key="midia.id" 
              class="card-item-download" 
              style="padding: 10px 14px; cursor: pointer; border-radius: 16px; gap: 12px;" 
              @click="alternarSelecaoItemModal(midia.caminhoOriginal)"
            >
              <input 
                type="checkbox" 
                :checked="itensSelecionadosParaNovaPlaylist.includes(midia.caminhoOriginal)" 
                style="width: 18px; height: 18px; cursor: pointer;" 
                @click.stop="alternarSelecaoItemModal(midia.caminhoOriginal)" 
              />

              <div style="width: 44px; height: 44px; border-radius: 10px; background: var(--bg-profundo); overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <img 
                  v-if="midia.capa" 
                  :src="midia.capa" 
                  alt="Capa" 
                  style="width: 100%; height: 100%; object-fit: cover;" 
                  @error="midia.capa = ''" 
                />
                <span v-else>
                  <svg v-if="midia.formato === 'mp4'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                    <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                    <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                    <path d="M9 17v-13h10v13" />
                    <path d="M9 8h10" />
                  </svg>
                </span>
              </div>

              <div style="flex: 1; min-width: 0;">
                <strong style="font-size: 13px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  {{ midia.titulo }}
                </strong>
                <span style="font-size: 11px; color: var(--texto-secundario);">
                  {{ midia.artista }}
                </span>
              </div>

              <span style="font-size: 11px; padding: 2px 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: var(--texto-secundario);">
                {{ midia.formato.toUpperCase() }}
              </span>
            </div>

            <div v-if="midiasFiltradasParaModal.length === 0" style="text-align: center; color: var(--texto-secundario); padding: 20px;">
              Nenhuma mídia encontrada na biblioteca.
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 14px;">
            <button class="botao-neu" @click="exibirModalCriarPlaylist = false">Cancelar</button>
            <button class="botao-neu botao-laranja" @click="confirmarCriarPlaylist">
              Criar Playlist ({{ itensSelecionadosParaNovaPlaylist.length }})
            </button>
          </div>
        </div>
      </div>

      <!-- 2. MODAL ADICIONAR MÍDIA EXISTENTE -->
      <div 
        v-if="midiaSelecionadaParaPlaylist" 
        class="modal-overlay" 
        @click.self="midiaSelecionadaParaPlaylist = null"
      >
        <div class="card-configuracoes-neu" style="width: 480px;">
          <h3 style="font-size: 18px; font-weight: 700;">Adicionar à Playlist</h3>
          <p style="font-size: 13px; color: var(--texto-secundario); margin-top: -10px;">
            {{ midiaSelecionadaParaPlaylist.titulo }}
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; max-height: 240px; overflow-y: auto;">
            <div 
              v-for="pl in listaPlaylists" 
              :key="pl.id" 
              class="card-item-download" 
              style="justify-content: space-between; padding: 12px 18px; cursor: pointer;" 
              @click="alternarMidiaNaPlaylist(pl.id, midiaSelecionadaParaPlaylist.caminhoOriginal)"
            >
              <span>{{ pl.nome }}</span>
              <span style="font-size: 18px;">
                <svg v-if="pl.itens.includes(midiaSelecionadaParaPlaylist.caminhoOriginal)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--destaque-laranja)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12l5 5l10 -10" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
              </span>
            </div>

            <div v-if="listaPlaylists.length === 0" style="text-align: center; color: var(--texto-secundario); padding: 12px;">
              Nenhuma playlist criada ainda.
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <button class="btn-limpar-campo" @click="abrirModalNovaPlaylist">+ Criar Nova Playlist</button>
            <button class="botao-neu botao-laranja" @click="midiaSelecionadaParaPlaylist = null">Concluir</button>
          </div>
        </div>
      </div>

      <!-- 3. MODAL CONFIGURAÇÕES -->
      <div 
        v-if="exibirModalConfiguracoes" 
        class="modal-overlay" 
        @click.self="alternarModalConfiguracoes"
      >
        <div class="card-configuracoes-neu" style="width: 520px;">
          <h3 style="font-size: 20px; font-weight: 700;">Configurações</h3>

          <div style="border-top: 1px solid var(--borda-sutil); padding-top: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 13px; font-weight: 600;">Versão do YSP</span>
                <span style="font-size: 12px; color: var(--texto-secundario); display: block;">v{{ versaoAtualApp }}</span>
              </div>
              <button v-if="!atualizacaoPronta" class="botao-neu" style="padding: 6px 14px; font-size: 12px;" @click="checarAtualizacoesManualmente">
                Verificar Atualizações
              </button>
              <button v-else class="botao-neu botao-laranja" style="padding: 6px 14px; font-size: 12px;" @click="aplicarAtualizacao">
                Reiniciar e Atualizar
              </button>
            </div>
            <p v-if="statusAtualizacaoTexto" style="font-size: 12px; color: var(--destaque-laranja); margin-top: 6px;">
              {{ statusAtualizacaoTexto }}
            </p>
          </div>

          <div>
            <label style="font-size: 13px; color: var(--texto-secundario); display: block; margin-bottom: 6px;">
              Pasta de Transferência:
            </label>
            <div style="display: flex; gap: 10px; align-items: center;">
              <div class="barra-downloader-pilula" style="flex: 1; max-width: none; border-radius: 16px; padding: 4px 12px;">
                <input 
                  type="text" 
                  :value="pastaPadrao" 
                  class="input-downloader-moderno" 
                  readonly 
                  style="font-size: 13px; text-overflow: ellipsis;" 
                />
              </div>
              <button class="botao-neu" @click="abrirSeletorPastaNativa" style="padding: 10px 16px; font-size: 13px;">
                Procurar...
              </button>
            </div>
          </div>

          <div>
            <label style="font-size: 13px; color: var(--texto-secundario); display: block; margin-bottom: 6px;">
              Qualidade de Áudio Padrão (MP3):
            </label>
            <div class="seletor-formato-pilulas" style="justify-content: space-between; margin-top: 0;">
              <button 
                :class="['btn-pilula-formato', { ativo: qualidadeAudioConfigurada === '128' }]" 
                @click="qualidadeAudioConfigurada = '128'"
              >
                128 kbps
              </button>
              <button 
                :class="['btn-pilula-formato', { ativo: qualidadeAudioConfigurada === '192' }]" 
                @click="qualidadeAudioConfigurada = '192'"
              >
                192 kbps
              </button>
              <button 
                :class="['btn-pilula-formato', { ativo: qualidadeAudioConfigurada === '320' }]" 
                @click="qualidadeAudioConfigurada = '320'"
              >
                320 kbps
              </button>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
            <button class="botao-neu" @click="alternarModalConfiguracoes">Cancelar</button>
            <button class="botao-neu botao-laranja" @click="salvarConfiguracoesAtuais">
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const telaAtual = ref('downloader_busca')
const exibirModalConfiguracoes = ref(false)
const exibirReprodutorVideo = ref(false)
const exibirReprodutorAudio = ref(false)
const containerVideoWindows = ref(null)
const urlEntrada = ref('')
const formatoEscolhido = ref('audio')
const selecionarTodos = ref(true)

// Logo dinâmico seguro contra crashes
const temLogoArquivo = ref(true)
const urlLogo = new URL('./assets/logo_ysp.png', import.meta.url).href

// Configurações e Auto-update
const pastaPadrao = ref('')
const qualidadeAudioConfigurada = ref('192')
const versaoAtualApp = ref('1.0.0')
const statusAtualizacaoTexto = ref('')
const progressoDownloadAtualizacao = ref(0)
const atualizacaoPronta = ref(false)

const buscando = ref(false)
const listaResultados = ref([])
const itensParaBaixar = ref([])

// Estados da Biblioteca e Filtro
const musicasBiblioteca = ref([])
const filtroBiblioteca = ref('')

// Estados de Playlists
const listaPlaylists = ref([])
const playlistAtiva = ref(null)
const exibirModalCriarPlaylist = ref(false)
const nomeNovaPlaylist = ref('')
const itensSelecionadosParaNovaPlaylist = ref([])
const termoBuscaModalPlaylist = ref('')
const midiaSelecionadaParaPlaylist = ref(null)

// Menu de Ações Rápidas (...)
const cardMenuAbertoId = ref(null)

// Motor de Mídia Único
const referenciaVideo = ref(null)
const estaTocando = ref(false)
const faixaAtiva = ref(null)
const tempoSegundosAtual = ref(0)
const tempoSegundosTotal = ref(0)
const volumeAtual = ref(0.8)
const repetirFaixa = ref(false)

const controlesVisiveis = ref(true)
let timerOcultarControles = null

// Filtragem geral da biblioteca
const musicasFiltradas = computed(() => {
  const busca = filtroBiblioteca.value.trim().toLowerCase()
  if (!busca) return musicasBiblioteca.value
  return musicasBiblioteca.value.filter(m => 
    m.titulo.toLowerCase().includes(busca) || m.artista.toLowerCase().includes(busca)
  )
})

const listaMusicas = computed(() => {
  return musicasFiltradas.value.filter(m => m.formato === 'mp3')
})

const listaVideos = computed(() => {
  return musicasFiltradas.value.filter(m => m.formato === 'mp4')
})

const itensDaPlaylistAtiva = computed(() => {
  if (!playlistAtiva.value) return []
  return musicasBiblioteca.value.filter(m => playlistAtiva.value.itens.includes(m.caminhoOriginal))
})

const midiasFiltradasParaModal = computed(() => {
  const termo = termoBuscaModalPlaylist.value.trim().toLowerCase()
  if (!termo) return musicasBiblioteca.value
  return musicasBiblioteca.value.filter(m => 
    m.titulo.toLowerCase().includes(termo) || m.artista.toLowerCase().includes(termo)
  )
})

const todosSelecionadosNoModal = computed(() => {
  if (midiasFiltradasParaModal.value.length === 0) return false
  return midiasFiltradasParaModal.value.every(m => itensSelecionadosParaNovaPlaylist.value.includes(m.caminhoOriginal))
})

const progressoPercentual = computed(() => {
  if (!tempoSegundosTotal.value) return 0
  return Math.min(100, (tempoSegundosAtual.value / tempoSegundosTotal.value) * 100)
})

const totalConcluidos = computed(() => {
  return itensParaBaixar.value.filter(item => item.status === 'concluido').length
})

const progressoGeral = computed(() => {
  if (itensParaBaixar.value.length === 0) return 0
  const soma = itensParaBaixar.value.reduce((tot, item) => tot + (item.progresso || 0), 0)
  return Math.round(soma / itensParaBaixar.value.length)
})

// Inicialização Unificada
onMounted(async () => {
  await carregarConfiguracoes()
  await carregarMidiasLocais()
  await carregarPlaylists()

  if (window.apiElectron) {
    versaoAtualApp.value = await window.apiElectron.obterVersaoApp()

    window.apiElectron.aoReceberProgresso((dadosEvento) => {
      const itemAlvo = itensParaBaixar.value.find(i => i.id === dadosEvento.id)
      if (itemAlvo) {
        itemAlvo.progresso = dadosEvento.progresso
        itemAlvo.statusTexto = dadosEvento.statusTexto
        if (dadosEvento.tipo === 'concluido') {
          itemAlvo.status = 'concluido'
          carregarMidiasLocais()
        }
        else if (dadosEvento.tipo === 'progresso') itemAlvo.status = 'baixando'
        else if (dadosEvento.tipo === 'processando') itemAlvo.status = 'convertendo'
        else if (dadosEvento.tipo === 'erro') itemAlvo.status = 'erro'
      }
    })

    window.apiElectron.aoReceberStatusAtualizacao((dados) => {
      if (dados.tipo === 'checando') statusAtualizacaoTexto.value = 'Buscando atualizações...'
      else if (dados.tipo === 'disponivel') statusAtualizacaoTexto.value = `Nova versão ${dados.versao} encontrada!`
      else if (dados.tipo === 'indisponivel') statusAtualizacaoTexto.value = 'Você já está na versão mais recente.'
      else if (dados.tipo === 'baixando') {
        statusAtualizacaoTexto.value = `Baixando nova versão: ${dados.porcentagem}%`
        progressoDownloadAtualizacao.value = dados.porcentagem
      }
      else if (dados.tipo === 'concluido') {
        statusAtualizacaoTexto.value = 'Atualização baixada!'
        atualizacaoPronta.value = true
      }
      else if (dados.tipo === 'erro') statusAtualizacaoTexto.value = `Erro: ${dados.mensagem}`
    })
  }
})

async function checarAtualizacoesManualmente() {
  if (window.apiElectron) {
    statusAtualizacaoTexto.value = 'Verificando...'
    const res = await window.apiElectron.verificarAtualizacao()
    if (!res.sucesso) {
      statusAtualizacaoTexto.value = res.erro
    }
  }
}

function aplicarAtualizacao() {
  if (window.apiElectron) {
    window.apiElectron.instalarAtualizacaoAgora()
  }
}

function alternarMenuCard(id) {
  cardMenuAbertoId.value = cardMenuAbertoId.value === id ? null : id
}

function fecharMenuCardAberto() {
  cardMenuAbertoId.value = null
}

async function abrirArquivoNoExplorador(caminhoOriginal) {
  cardMenuAbertoId.value = null
  if (window.apiElectron) {
    const res = await window.apiElectron.abrirNoExplorador(caminhoOriginal)
    if (!res.sucesso) alert(res.erro || "Falha ao abrir pasta.")
  }
}

async function confirmarExcluirMidia(midia) {
  cardMenuAbertoId.value = null
  if (!confirm(`Deseja realmente apagar "${midia.titulo}" permanentemente do disco?`)) return

  if (window.apiElectron) {
    const res = await window.apiElectron.excluirMidiaDisco(midia.caminhoOriginal)
    if (res.sucesso) {
      if (faixaAtiva.value && faixaAtiva.value.caminhoOriginal === midia.caminhoOriginal) {
        if (referenciaVideo.value) referenciaVideo.value.pause()
        estaTocando.value = false
        faixaAtiva.value = null
        fecharReprodutores()
      }
      await carregarMidiasLocais()
      await carregarPlaylists()
    } else {
      alert("Erro ao excluir arquivo: " + (res.erro || "Falha desconhecida"))
    }
  }
}

async function carregarConfiguracoes() {
  if (window.apiElectron) {
    const res = await window.apiElectron.obterConfiguracoes()
    if (res && res.sucesso && res.configuracoes) {
      pastaPadrao.value = res.configuracoes.pastaDownload
      qualidadeAudioConfigurada.value = res.configuracoes.qualidadeAudio || '192'
    }
  }
}

async function abrirSeletorPastaNativa() {
  if (window.apiElectron) {
    const res = await window.apiElectron.selecionarPastaDialogo()
    if (res && res.sucesso && res.caminho) {
      pastaPadrao.value = res.caminho
    }
  }
}

async function salvarConfiguracoesAtuais() {
  if (!window.apiElectron) return
  const res = await window.apiElectron.salvarConfiguracoes({
    pastaDownload: pastaPadrao.value,
    qualidadeAudio: qualidadeAudioConfigurada.value
  })
  if (res && res.sucesso) {
    exibirModalConfiguracoes.value = false
    await carregarMidiasLocais()
    await carregarPlaylists()
  } else {
    alert("Erro ao salvar configurações: " + (res.erro || "Falha desconhecida"))
  }
}

function formatarTempo(segundos) {
  if (!segundos || isNaN(segundos)) return '0:00'
  const min = Math.floor(segundos / 60)
  const seg = Math.floor(segundos % 60)
  return `${min}:${seg < 10 ? '0' : ''}${seg}`
}

function formatarTempoWindows(segundos) {
  if (!segundos || isNaN(segundos)) return '00:00:00'
  const segInt = Math.floor(segundos)
  const horas = Math.floor(segInt / 3600)
  const minutos = Math.floor((segInt % 3600) / 60)
  const segs = segInt % 60
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`
}

function formatarData(dataIso) {
  if (!dataIso) return ''
  const d = new Date(dataIso)
  return d.toLocaleDateString('pt-BR')
}

async function carregarMidiasLocais() {
  if (window.apiElectron) {
    const res = await window.apiElectron.lerBibliotecaLocal()
    if (res.sucesso) {
      musicasBiblioteca.value = res.musicas
      if (!faixaAtiva.value && res.musicas.length > 0) {
        faixaAtiva.value = res.musicas[0]
      }
    }
  }
}

async function carregarPlaylists() {
  if (window.apiElectron) {
    const res = await window.apiElectron.obterPlaylists()
    if (res.sucesso) {
      listaPlaylists.value = res.playlists
    }
  }
}

async function abrirModalNovaPlaylist() {
  await carregarMidiasLocais()
  nomeNovaPlaylist.value = ''
  termoBuscaModalPlaylist.value = ''
  itensSelecionadosParaNovaPlaylist.value = []
  exibirModalCriarPlaylist.value = true
}

function alternarSelecaoItemModal(caminhoOriginal) {
  const indice = itensSelecionadosParaNovaPlaylist.value.indexOf(caminhoOriginal)
  if (indice === -1) {
    itensSelecionadosParaNovaPlaylist.value.push(caminhoOriginal)
  } else {
    itensSelecionadosParaNovaPlaylist.value.splice(indice, 1)
  }
}

function alternarSelecionarTodasMidiasModal() {
  if (todosSelecionadosNoModal.value) {
    const caminhosVisiveis = midiasFiltradasParaModal.value.map(m => m.caminhoOriginal)
    itensSelecionadosParaNovaPlaylist.value = itensSelecionadosParaNovaPlaylist.value.filter(
      c => !caminhosVisiveis.includes(c)
    )
  } else {
    midiasFiltradasParaModal.value.forEach(m => {
      if (!itensSelecionadosParaNovaPlaylist.value.includes(m.caminhoOriginal)) {
        itensSelecionadosParaNovaPlaylist.value.push(m.caminhoOriginal)
      }
    })
  }
}

async function confirmarCriarPlaylist() {
  const nomeLimpo = (nomeNovaPlaylist.value || '').trim()
  if (!nomeLimpo) {
    return alert("Por favor, digite um nome para a playlist.")
  }

  if (!window.apiElectron) {
    return alert("Erro: API Electron indisponível.")
  }

  try {
    const listaItensPura = JSON.parse(JSON.stringify(itensSelecionadosParaNovaPlaylist.value))

    const res = await window.apiElectron.criarPlaylist({
      nome: nomeLimpo,
      itens: listaItensPura
    })

    if (res && res.sucesso) {
      listaPlaylists.value = res.playlists
      exibirModalCriarPlaylist.value = false
      nomeNovaPlaylist.value = ''
      itensSelecionadosParaNovaPlaylist.value = []
    } else {
      alert("Erro ao criar playlist: " + (res && res.erro ? res.erro : "Falha desconhecida"))
    }
  } catch (erro) {
    alert("Falha de comunicação: " + erro.message)
  }
}

function abrirDetalhePlaylist(pl) {
  playlistAtiva.value = pl
  telaAtual.value = 'playlist_detalhe'
}

async function deletarPlaylistAtual(idPlaylist) {
  if (!confirm("Deseja realmente excluir esta playlist?")) return
  if (window.apiElectron) {
    const res = await window.apiElectron.excluirPlaylist(idPlaylist)
    if (res.sucesso) {
      listaPlaylists.value = res.playlists
      playlistAtiva.value = null
      telaAtual.value = 'playlists'
    }
  }
}

function abrirModalGerenciarPlaylist(midia) {
  cardMenuAbertoId.value = null
  midiaSelecionadaParaPlaylist.value = midia
}

async function alternarMidiaNaPlaylist(idPlaylist, caminhoArquivo) {
  if (window.apiElectron) {
    const res = await window.apiElectron.alternarItemPlaylist({ idPlaylist, caminhoArquivo })
    if (res.sucesso) {
      listaPlaylists.value = res.playlists
      if (playlistAtiva.value && playlistAtiva.value.id === idPlaylist) {
        playlistAtiva.value = res.playlists.find(p => p.id === idPlaylist)
      }
    }
  }
}

async function removerMidiaDaPlaylist(idPlaylist, caminhoArquivo) {
  cardMenuAbertoId.value = null
  await alternarMidiaNaPlaylist(idPlaylist, caminhoArquivo)
}

function irPara(nomeTela) {
  telaAtual.value = nomeTela
}

function abrirPlayer() {
  telaAtual.value = 'player'
  carregarMidiasLocais()
}

function alternarModalConfiguracoes() {
  exibirModalConfiguracoes.value = !exibirModalConfiguracoes.value
}

function abrirModoExpandido() {
  if (!faixaAtiva.value && musicasBiblioteca.value.length > 0) {
    faixaAtiva.value = musicasBiblioteca.value[0]
  }
  if (!faixaAtiva.value) return

  if (faixaAtiva.value.formato === 'mp4') {
    exibirReprodutorVideo.value = true
    aoMoverMouseVideo()
  } else {
    exibirReprodutorAudio.value = true
  }
}

function fecharReprodutores() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {})
  }
  exibirReprodutorVideo.value = false
  exibirReprodutorAudio.value = false
}

function alternarTelaCheiaVideo() {
  if (!exibirReprodutorVideo.value && faixaAtiva.value && faixaAtiva.value.formato === 'mp4') {
    exibirReprodutorVideo.value = true
  }
  
  nextTick(() => {
    const container = containerVideoWindows.value
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  })
}

function aoMoverMouseVideo() {
  controlesVisiveis.value = true
  clearTimeout(timerOcultarControles)
  timerOcultarControles = setTimeout(() => {
    if (estaTocando.value) {
      controlesVisiveis.value = false
    }
  }, 2800)
}

function esconderControlesImediatamente() {
  if (estaTocando.value) {
    controlesVisiveis.value = false
  }
}

function tocarFaixa(musica) {
  faixaAtiva.value = musica
  const vid = referenciaVideo.value
  if (!vid) return

  vid.src = musica.urlAudio
  vid.volume = volumeAtual.value
  vid.load()
  vid.play()
    .then(() => {
      estaTocando.value = true
      if (musica.formato === 'mp4') {
        exibirReprodutorVideo.value = true
        aoMoverMouseVideo()
      }
    })
    .catch((err) => {
      console.error("Erro ao reproduzir mídia:", err)
      estaTocando.value = false
    })
}

function alternarPlayPause() {
  const vid = referenciaVideo.value
  if (!vid || !faixaAtiva.value) {
    if (musicasBiblioteca.value.length > 0) {
      tocarFaixa(musicasBiblioteca.value[0])
    }
    return
  }

  if (estaTocando.value) {
    vid.pause()
    estaTocando.value = false
    controlesVisiveis.value = true
  } else {
    vid.play().then(() => {
      estaTocando.value = true
      aoMoverMouseVideo()
    })
  }
}

function tocarProxima() {
  const listaReferencia = (telaAtual.value === 'playlist_detalhe' && itensDaPlaylistAtiva.value.length > 0)
    ? itensDaPlaylistAtiva.value
    : musicasBiblioteca.value

  if (!listaReferencia.length || !faixaAtiva.value) return
  const indiceAtual = listaReferencia.findIndex(m => m.id === faixaAtiva.value.id)
  const proximoIndice = (indiceAtual + 1) % listaReferencia.length
  tocarFaixa(listaReferencia[proximoIndice])
}

function tocarAnterior() {
  const listaReferencia = (telaAtual.value === 'playlist_detalhe' && itensDaPlaylistAtiva.value.length > 0)
    ? itensDaPlaylistAtiva.value
    : musicasBiblioteca.value

  if (!listaReferencia.length || !faixaAtiva.value) return
  const indiceAtual = listaReferencia.findIndex(m => m.id === faixaAtiva.value.id)
  const anteriorIndice = (indiceAtual - 1 + listaReferencia.length) % listaReferencia.length
  tocarFaixa(listaReferencia[anteriorIndice])
}

function alternarAleatorio() {
  const listaReferencia = (telaAtual.value === 'playlist_detalhe' && itensDaPlaylistAtiva.value.length > 0)
    ? itensDaPlaylistAtiva.value
    : musicasBiblioteca.value

  if (listaReferencia.length <= 1) return
  const indiceAleatorio = Math.floor(Math.random() * listaReferencia.length)
  tocarFaixa(listaReferencia[indiceAleatorio])
}

function avancarRecuar(segundos) {
  const vid = referenciaVideo.value
  if (!vid) return
  vid.currentTime = Math.max(0, Math.min(vid.duration || 0, vid.currentTime + segundos))
  aoMoverMouseVideo()
}

function navegarTempoAudio(evento) {
  const vid = referenciaVideo.value
  if (!vid || !vid.duration) return
  const retangulo = evento.currentTarget.getBoundingClientRect()
  const cliqueX = evento.clientX - retangulo.left
  const percentual = Math.max(0, Math.min(1, cliqueX / retangulo.width))
  vid.currentTime = percentual * vid.duration
}

function navegarTempoVideo(evento) {
  const vid = referenciaVideo.value
  if (!vid || !vid.duration) return
  const retangulo = evento.currentTarget.getBoundingClientRect()
  const cliqueX = evento.clientX - retangulo.left
  const percentual = Math.max(0, Math.min(1, cliqueX / retangulo.width))
  vid.currentTime = percentual * vid.duration
  aoMoverMouseVideo()
}

function ajustarVolume() {
  if (referenciaVideo.value) {
    referenciaVideo.value.volume = volumeAtual.value
  }
}

function alternarMudo() {
  if (!referenciaVideo.value) return
  if (volumeAtual.value > 0) {
    volumeAtual.value = 0
    referenciaVideo.value.volume = 0
  } else {
    volumeAtual.value = 0.8
    referenciaVideo.value.volume = 0.8
  }
}

function aoAtualizarTempo() {
  if (referenciaVideo.value) {
    tempoSegundosAtual.value = referenciaVideo.value.currentTime
  }
}

function aoCarregarMetadados() {
  if (referenciaVideo.value) {
    tempoSegundosTotal.value = referenciaVideo.value.duration || 0
  }
}

function aoFinalizarFaixa() {
  if (repetirFaixa.value) {
    if (referenciaVideo.value) {
      referenciaVideo.value.currentTime = 0
      referenciaVideo.value.play()
    }
  } else {
    tocarProxima()
  }
}

function aoOcorrerErroMidia(e) {
  console.error("Erro na reprodução do stream:", e)
  estaTocando.value = false
}

async function processarBusca() {
  const urlLimpa = urlEntrada.value.trim()
  if (!urlLimpa) return alert("Por favor, cole um link antes de continuar!")
  if (!window.apiElectron) return alert("Electron não detectado.")

  buscando.value = true
  try {
    const resposta = await window.apiElectron.extrairMetadados(urlLimpa)
    if (resposta.sucesso && resposta.itens.length > 0) {
      listaResultados.value = resposta.itens
      selecionarTodos.value = true
      telaAtual.value = 'downloader_resultados'
    } else {
      alert(resposta.erro || "Nenhum vídeo pôde ser recuperado.")
    }
  } catch (erro) {
    alert("Erro na extração: " + erro.message)
  } finally {
    buscando.value = false
  }
}

function alternarTodos() {
  listaResultados.value.forEach(item => { item.selecionado = selecionarTodos.value })
}

function iniciarFilaDownload() {
  const selecionados = listaResultados.value.filter(i => i.selecionado)
  if (selecionados.length === 0) return alert("Selecione pelo menos um item para baixar!")

  itensParaBaixar.value = selecionados.map(item => ({
    ...item,
    status: 'aguardando',
    statusTexto: 'Aguardando...',
    progresso: 0
  }))

  telaAtual.value = 'downloader_fila'

  if (window.apiElectron) {
    window.apiElectron.iniciarDownload({
      itens: selecionados.map(i => ({ id: i.id, url: i.url })),
      formato: formatoEscolhido.value,
      pastaDestino: pastaPadrao.value,
      qualidadeAudio: qualidadeAudioConfigurada.value
    })
  }
}

function obterEstiloBadge(status) {
  if (status === 'concluido') return { background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71' }
  if (status === 'baixando') return { background: 'rgba(255, 71, 38, 0.2)', color: 'var(--destaque-laranja)' }
  if (status === 'convertendo') return { background: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f' }
  if (status === 'erro') return { background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c' }
  return { background: 'rgba(255, 255, 255, 0.08)', color: 'var(--texto-secundario)' }
}
</script>