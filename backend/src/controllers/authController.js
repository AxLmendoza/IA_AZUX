const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, pwd } = req.body;
  console.log('Intentando login para:', email); // <-- Agregado

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error('Usuario no encontrado:', email); // <-- Agregado
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(pwd, user.pwd);
    if (!valid) {
      console.error('Contraseña incorrecta para:', email); // <-- Agregado
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.AUTH_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { email: user.email, _id: user._id } });
  } catch (err) {
    console.error('Error en login:', err); // <-- Agregado
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};