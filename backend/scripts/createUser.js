const mongoose = require('mongoose');
const User = require('../src/models/Users');

async function crearUsuario() {
  await mongoose.connect('mongodb+srv://dev:Dev.404@dev.cmoubyk.mongodb.net/aiQuote?retryWrites=true&w=majority'); // String de conexión 

  const nuevoUsuario = new User({
    name:       "Nuevo",
    lastName:   "Usuario",
    email:      "axl@ejemplo.com",
    phone:      "5512345678",
    pwd:        "123456789", // Contraseña en texto plano
    status:     "Activo",
    createdAt:  Date.now(),
    lastUpdate: Date.now(),
    _functions: [],
    _business:  [],
    _client:    [],
    validateKey: {
      limitCodeTime: Date.now() + 1000 * 60 * 60 * 24,
      resetPassword: { resetCode: null, validCode: false },
      validateEmail: { emailVerified: false },
      validatePhone: { validCodePhone: false },
      failedAttempts: 0
    },
    data: {
      changePwd: true,
      entidad:   null,
      cargo:     null,
      adscripcion: null,
      id:        "100000",
      responsible: false
    },
    tokens: []
  });

  await nuevoUsuario.save();
  console.log('Usuario creado correctamente');
  mongoose.disconnect();
}

crearUsuario().catch(console.error);