const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const { IAMRouter, IAMSwagger } = require('aloux-iam');
const authRoutes = require('./routes/auth');
const quoteRoutes = require('./routes/quote');
const methodOverride = require('method-override');

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Conexión a MongoDB exitosa');

const app = express();
app.use(express.json());
app.use(methodOverride());
app.use(IAMRouter);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});


    app.use('/docs-iam', swaggerUI.serve, swaggerUI.setup(IAMSwagger));

    app.use('/api/auth', authRoutes);
    app.use('/api/quote', quoteRoutes);

    const PORT = process.env.PORT || 2018;
    app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });
