require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const quoteRoutes = require('./routes/quote');

const app = express(); 
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/quote', quoteRoutes); 

// Iniciar servidor
const PORT = process.env.PORT || 2018;
app.listen(PORT, () => console.log(`-----Servidor corriendo en puerto------ ${PORT}`));