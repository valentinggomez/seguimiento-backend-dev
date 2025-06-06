// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const respuestasRoute = require('./routes/respuestas');

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para leer JSON en el body

// Rutas
app.use('/respuestas', respuestasRoute);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en puerto ${PORT}`);
});
 