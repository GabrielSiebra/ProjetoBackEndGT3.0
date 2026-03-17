const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

// Rota base de usuários
app.use('/v1/user', userRoutes); // Prefixo exigido no escopo

module.exports = app;