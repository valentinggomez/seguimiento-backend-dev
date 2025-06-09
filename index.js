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
const allowedOrigins = [
  'http://localhost:3000',
  'https://seguimiento-frontend-dev.vercel.app',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}))

app.use(express.json()); // Para leer JSON en el body

// Rutas
app.use('/respuestas', respuestasRoute);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en puerto ${PORT}`);
});
 