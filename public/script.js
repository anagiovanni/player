document.addEventListener('DOMContentLoaded', () => {
    const nomePlaylist = document.getElementById('nome-playlist');
    const detalhesPlaylist = document.getElementById('detalhes-playlist');
    const listaMusicas = document.getElementById('lista-musicas');
    const playerAudio = document.getElementById('player-audio');
    const botaoPlay = document.getElementById('play');
    const botaoAleatorio = document.getElementById('tocar-musica-aleatoria');
    const albumArt = document.getElementById('album-art');

    let primeiraMusica = null;
    let musicas = [];
    let modoAleatorio = false; // Controle de modo

    // Obtém o ID do álbum da URL
    const params = new URLSearchParams(window.location.search);
    const albumID = params.get('album');

    fetch(`/playlist?album=${albumID}`)
        .then(resposta => resposta.json())
        .then(dados => {
            if (dados.Musicas && Array.isArray(dados.Musicas)) {
                nomePlaylist.textContent = dados.NomeDaPlaylist;
                detalhesPlaylist.textContent = `Criado por: ${dados.Artista} em ${dados.DataDeCriacao}`;
                albumArt.src = dados.Capa; // Define a capa do álbum

                dados.Musicas.forEach((musica, indice) => {
                    const itemLista = document.createElement('li');
                    itemLista.textContent = `${musica.Titulo} - ${dados.Artista}`;
                    itemLista.addEventListener('click', () => {
                        tocarMusica(indice);
                    });
                    listaMusicas.appendChild(itemLista);

                    if (indice === 0) {
                        primeiraMusica = musica.Titulo; // Salva a primeira música para o botão PLAY
                    }
                    musicas.push(musica.Titulo); // Armazena as músicas na lista
                });
            } else {
                console.error('Estrutura de músicas não encontrada ou formato inválido.');
            }
        })
        .catch(erro => {
            console.error('Erro ao obter a playlist:', erro);
        });

    playerAudio.addEventListener('ended', () => {
        if (modoAleatorio) {
            tocarMusicaAleatoria();
        } else {
            tocarProximaMusica();
        }
    });

    function tocarMusica(indice) {
        const titulo = musicas[indice];
        if (titulo) {
            const caminhoMusica = `/musicas/${titulo}.mp3`;
            playerAudio.src = caminhoMusica;
            playerAudio.play();

            document.querySelectorAll('#lista-musicas li').forEach((item, i) => {
                item.classList.toggle('active', i === indice);
            });
            playerAudio.setAttribute('data-current-index', indice);
        }
    }

    function tocarProximaMusica() {
        const currentIndex = parseInt(playerAudio.getAttribute('data-current-index'), 10);
        const nextIndex = (currentIndex + 1) % musicas.length; // Vai para a próxima música ou volta ao início
        tocarMusica(nextIndex);
    }

    function tocarMusicaAleatoria() {
        const randomIndex = Math.floor(Math.random() * musicas.length); // Gera um índice aleatório válido
        tocarMusica(randomIndex);
    }

    // Adiciona o evento de clique ao botão de música aleatória
    botaoAleatorio.addEventListener('click', () => {
        modoAleatorio = true; // Ativa o modo aleatório
        tocarMusicaAleatoria();
    });

    // Adiciona o evento de clique ao botão de play
    botaoPlay.addEventListener('click', () => {
        modoAleatorio = false; // Desativa o modo aleatório
        tocarMusica(0); // Começa a tocar a primeira música
    });

    window.tocarPrimeiraMusica = function() {
        tocarMusica(0); // Toca a primeira música
    };
});