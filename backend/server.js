// backend/server.js
const express = require('express');
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const port = 5000;

app.use(express.json());

app.use('/api', apiRoutes);  // Usando as rotas

// Rota simples
app.get('/', (req, res) => {
    res.send('Backend funcionando!');
});

// API de exemplo
app.get('/api', (req, res) => {
    res.json({ message: 'API do backend funcionando' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
