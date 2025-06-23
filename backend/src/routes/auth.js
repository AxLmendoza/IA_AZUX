const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Log para saber si la petición llega a la ruta
router.post('/login', (req, res, next) => {
  console.log('Petición recibida en /api/auth/login');
  console.log('Body recibido:', req.body); 
  next();
}, authController.login);

module.exports = router;