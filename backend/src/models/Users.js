const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String },
  pwd:        { type: String, required: true },
  status:     { type: String, default: 'Activo' },
  _functions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Function' }],
  _business:  [{ /* ... */ }],
  _client:    [{ /* ... */ }],
  validateKey:{ /* ... */ },
  data:       { /* ... */ },
  tokens:     [{ /* ... */ }]
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'lastUpdate' }
});

// Hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (this.isModified('pwd')) {
    const salt = await bcrypt.genSalt(8);
    this.pwd = await bcrypt.hash(this.pwd, salt);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
