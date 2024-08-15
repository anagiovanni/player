const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Caminho para o arquivo JSON
const dataFilePath = path.join(__dirname, 'data', 'albuns.json');

// Serve arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para obter a lista de álbuns
app.get('/albuns', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de dados:', err);
            return res.status(500).json({ error: 'Erro ao ler o arquivo de dados.' });
        }
        try {
            const jsonData = JSON.parse(data);
            res.json({ Albuns: jsonData.Albuns });
        } catch (parseError) {
            console.error('Erro ao parsear JSON:', parseError);
            res.status(500).json({ error: 'Erro ao processar os dados JSON.' });
        }
    });
});

// Rota para obter a playlist de um álbum específico
app.get('/playlist', (req, res) => {
    const albumID = req.query.album;
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de dados:', err);
            return res.status(500).json({ error: 'Erro ao ler o arquivo de dados.' });
        }
        try {
            const jsonData = JSON.parse(data);
            const playlistData = jsonData.Playlists[albumID];
            if (playlistData) {
                res.json(playlistData);
            } else {
                res.status(404).json({ error: 'Playlist não encontrada' });
            }
        } catch (parseError) {
            console.error('Erro ao parsear JSON:', parseError);
            res.status(500).json({ error: 'Erro ao processar os dados JSON.' });
        }
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});