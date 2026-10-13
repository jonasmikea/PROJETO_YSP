import sys
import io
import json
import yt_dlp

# Garante que a saída padrão no Windows utilize codificação UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def formatar_duracao(segundos):
    if not segundos:
        return "--:--"
    segundos = int(segundos)
    minutos, segs = divmod(segundos, 60)
    horas, minutos = divmod(minutos, 60)
    if horas > 0:
        return f"{horas:02d}:{minutos:02d}:{segs:02d}"
    return f"{minutos:02d}:{segs:02d}"

def extrair_metadados(url_alvo):
    configuracoes = {
        'extract_flat': 'in_playlist',
        'skip_download': True,
        'quiet': True,
        'no_warnings': True,
        'ignoreerrors': True,
    }

    try:
        with yt_dlp.YoutubeDL(configuracoes) as cliente_ytdlp:
            informacoes = cliente_ytdlp.extract_info(url_alvo, download=False)

            if not informacoes:
                return {"sucesso": False, "erro": "Nenhum conteúdo encontrado ou vídeo indisponível."}

            lista_itens = []

            # Trata playlist ou canal
            if 'entries' in informacoes:
                for entrada in informacoes['entries']:
                    if not entrada:
                        continue
                    
                    id_video = entrada.get('id', '')
                    url_video = entrada.get('url') or f"https://www.youtube.com/watch?v={id_video}"
                    thumb = entrada.get('thumbnails', [{}])[-1].get('url') if entrada.get('thumbnails') else f"https://i.ytimg.com/vi/{id_video}/hqdefault.jpg"

                    lista_itens.append({
                        "id": id_video,
                        "url": url_video,
                        "titulo": entrada.get('title', 'Sem título'),
                        "duracao_segundos": entrada.get('duration', 0),
                        "duracao": formatar_duracao(entrada.get('duration', 0)),
                        "thumbnail": thumb,
                        "selecionado": True
                    })
            else:
                # Trata vídeo único
                id_video = informacoes.get('id', '')
                thumb = informacoes.get('thumbnail') or f"https://i.ytimg.com/vi/{id_video}/hqdefault.jpg"
                lista_itens.append({
                    "id": id_video,
                    "url": informacoes.get('webpage_url') or url_alvo,
                    "titulo": informacoes.get('title', 'Sem título'),
                    "duracao_segundos": informacoes.get('duration', 0),
                    "duracao": formatar_duracao(informacoes.get('duration', 0)),
                    "thumbnail": thumb,
                    "selecionado": True
                })

            return {"sucesso": True, "itens": lista_itens, "total": len(lista_itens)}

    except Exception as erro:
        return {"sucesso": False, "erro": str(erro)}

if __name__ == '__main__':
    if len(sys.argv) > 1:
        link = sys.argv[1]
        resultado = extrair_metadados(link)
        print(json.dumps(resultado, ensure_ascii=False))
    else:
        print(json.dumps({"sucesso": False, "erro": "Nenhuma URL fornecida."}))