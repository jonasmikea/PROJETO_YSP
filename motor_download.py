import sys
import io
import os
import json
import re
import shutil
import yt_dlp

# Garante suporte a UTF-8 no Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

padrao_ansi = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')

def limpar_ansi(texto):
    if not texto:
        return ""
    return padrao_ansi.sub('', texto).strip()

def enviar_evento(tipo, id_video, progresso=0, status_texto="", velocidade="", eta=""):
    pacote = {
        "tipo": tipo,
        "id": id_video,
        "progresso": progresso,
        "statusTexto": status_texto,
        "velocidade": velocidade,
        "eta": eta
    }
    print(f"__EVENTO_YSP__{json.dumps(pacote, ensure_ascii=False)}", flush=True)

def processar_fila(itens, formato, pasta_destino, qualidade_audio="192"):
    pasta_capas = os.path.join(pasta_destino, "capas")
    os.makedirs(pasta_destino, exist_ok=True)
    os.makedirs(pasta_capas, exist_ok=True)
    
    id_atual = None

    def hook_progresso(d):
        nonlocal id_atual
        status = d.get('status')
        if status == 'downloading':
            total = d.get('total_bytes') or d.get('total_bytes_estimate') or 0
            baixado = d.get('downloaded_bytes', 0)
            porcentagem = round((baixado / total) * 100, 1) if total > 0 else 0
            
            vel = limpar_ansi(d.get('_speed_str', ''))
            eta = limpar_ansi(d.get('_eta_str', ''))
            
            enviar_evento('progresso', id_atual, progresso=porcentagem, 
                          status_texto=f"Baixando {porcentagem}%", velocidade=vel, eta=eta)
        elif status == 'finished':
            enviar_evento('processando', id_atual, progresso=99, status_texto="Salvando capa e finalizando...")

    for item in itens:
        id_atual = item['id']
        url = item.get('url') or f"https://www.youtube.com/watch?v={id_atual}"

        enviar_evento('inicio', id_atual, progresso=0, status_texto="Iniciando...")

        template_midia = os.path.join(pasta_destino, "%(title)s.%(ext)s")

        opcoes = {
            'outtmpl': template_midia,
            'progress_hooks': [hook_progresso],
            'writethumbnail': True,
            'quiet': True,
            'no_warnings': True,
            'ignoreerrors': True,
            'noplaylist': True
        }

        if formato == 'audio':
            opcoes.update({
                'format': 'bestaudio/best',
                'postprocessors': [
                    {
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': str(qualidade_audio),
                    },
                    {
                        'key': 'FFmpegThumbnailsConvertor',
                        'format': 'jpg',
                    },
                    {
                        'key': 'FFmpegMetadata',
                    },
                    {
                        'key': 'EmbedThumbnail',
                        'already_have_thumbnail': False,
                    }
                ],
            })
        else:
            opcoes.update({
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best',
                'merge_output_format': 'mp4',
                'postprocessors': [
                    {
                        'key': 'FFmpegThumbnailsConvertor',
                        'format': 'jpg',
                    }
                ],
                'postprocessor_args': {
                    'merger': ['-c:v', 'copy', '-c:a', 'aac']
                }
            })

        try:
            with yt_dlp.YoutubeDL(opcoes) as ydl:
                info = ydl.extract_info(url, download=True)
                titulo_sanitizado = ydl.prepare_filename(info)
                nome_base = os.path.splitext(os.path.basename(titulo_sanitizado))[0]

                for ext in ['.jpg', '.webp', '.png', '.jpeg']:
                    candidato = os.path.splitext(titulo_sanitizado)[0] + ext
                    if os.path.exists(candidato):
                        destino_capa = os.path.join(pasta_capas, f"{nome_base}.jpg")
                        shutil.copyfile(candidato, destino_capa)
                        break

            enviar_evento('concluido', id_atual, progresso=100, status_texto="Concluído ✓")
        except Exception as erro:
            enviar_evento('erro', id_atual, progresso=0, status_texto=f"Erro: {str(erro)}")

    enviar_evento('fim_lote', None, progresso=100, status_texto="Lote finalizado")

if __name__ == '__main__':
    if len(sys.argv) > 3:
        itens_json = json.loads(sys.argv[1])
        formato_escolhido = sys.argv[2]
        pasta = sys.argv[3]
        qualidade = sys.argv[4] if len(sys.argv) > 4 else "192"
        processar_fila(itens_json, formato_escolhido, pasta, qualidade)
    else:
        print("Argumentos insuficientes.")