const express = require('express');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const Quote = require('../models/Quote');
const router = express.Router();

// Guardar cotización y devolver PDF
router.post('/generate', async (req, res) => {
  const { cliente, email, requerimiento } = req.body;

  try {
    //Llama a la IA para generar la cotización
    const prompt = `Genera una cotización para el siguiente requerimiento:\nCliente: ${cliente}\nCorreo: ${email}\nRequerimiento: ${requerimiento}`;
    const groqRes = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'Eres un generador de cotizaciones.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer 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`, 
          'Content-Type': 'application/json'
        }
      }
    );

    // Manejo seguro de la respuesta
    let cotizacion = 'Sin respuesta';
    if (
      groqRes.data &&
      groqRes.data.choices &&
      groqRes.data.choices[0] &&
      groqRes.data.choices[0].message &&
      groqRes.data.choices[0].message.content
    ) {
      cotizacion = groqRes.data.choices[0].message.content;
    }

    //Guarda en la base de datos
    const nuevaCotizacion = await Quote.create({
      cliente,
      email,
      requerimiento,
      cotizacion
    });

    //Genera el PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cotizacion_${nuevaCotizacion._id}.pdf"`);
    doc.fontSize(18).text('Cotización generada por IA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Cliente: ${cliente}`);
    doc.text(`Correo: ${email}`);
    doc.text(`Requerimiento: ${requerimiento}`);
    doc.moveDown();
    doc.text('Cotización:', { underline: true });
    doc.moveDown();
    doc.text(cotizacion);
    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generando la cotización' });
  }
});

// Obtener todas las cotizaciones (para Home.vue)
router.get('/all', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ fecha: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo cotizaciones' });
  }
});

// Descargar PDF por ID
router.get('/pdf/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ error: 'No encontrada' });

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cotizacion_${quote._id}.pdf"`);
    doc.fontSize(18).text('Cotización generada por IA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Cliente: ${quote.cliente}`);
    doc.text(`Correo: ${quote.email}`);
    doc.text(`Requerimiento: ${quote.requerimiento}`);
    doc.moveDown();
    doc.text('Cotización:', { underline: true });
    doc.moveDown();
    doc.text(quote.cotizacion);
    doc.end();
    doc.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generando PDF' });
  }
});
module.exports = router;