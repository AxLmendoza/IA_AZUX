//Conexion de Mongoose y definición del modelo Quote
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  cliente: String,
  email: String,
  requerimiento: String,
  cotizacion: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);