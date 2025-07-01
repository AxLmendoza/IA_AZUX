const express = require('express');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Quote = require('../models/Quote');
const router = express.Router();

// Eliminar cotización por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Quote.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'No encontrada' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando la cotización' });
  }
});


// Ruta: Generar cotización y devolver PDF
router.post('/generate', async (req, res) => {
  const { cliente, email, requerimiento } = req.body;

  try {
    //Generar cotización con IA
    const prompt = `Genera una cotización para el siguiente requerimiento:\nCliente: ${cliente}\nCorreo: ${email}\nRequerimiento: ${requerimiento}`;
    let cotizacion = 'Sin respuesta';
    try {
      const groqRes = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: 'Eres un generador de cotizaciones profesionales.' },
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
      cotizacion = groqRes.data.choices[0]?.message?.content || cotizacion;
    } catch (iaErr) {
      console.error('Error IA:', iaErr.response?.data || iaErr.message);
      cotizacion = 'No se pudo generar la cotización automáticamente.';
    }

    //Guardar cotización en BD
    const nuevaCotizacion = await Quote.create({ cliente, email, requerimiento, cotizacion });

    //Configurar PDF (fondo en todas las páginas y margen superior)
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 160, right: 50, bottom: 50, left: 50 }
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cotizacion_${nuevaCotizacion._id}.pdf"`);
    doc.pipe(res);

    // Función para pintar plantilla en cada página
    function pintaPlantilla() {
      const bgPath = path.join(__dirname, '../../assets/plantilla_cotizacion.jpeg');
      if (fs.existsSync(bgPath)) {
        doc.image(bgPath, 0, 0, { width: doc.page.width, height: doc.page.height });
      }
    }
    // Pinta en la primera página
    pintaPlantilla();
    // Pinta en todas las siguientes
    doc.on('pageAdded', pintaPlantilla);

    //Contenido: encabezado y datos cliente
    doc
      .font('Helvetica')
      .fontSize(18)
      .fillColor('#222')
      .text('Cotización generada por IA', { align: 'center', lineGap: 4 });

    doc
      .moveDown(0.5)
      .fontSize(12)
      .fillColor('#000')
      .text(`Cliente: ${cliente}`, { lineGap: 2 })
      .text(`Correo: ${email}`, { lineGap: 2 })
      .text(`Requerimiento: ${requerimiento}`, { lineGap: 2 });

    doc
      .moveDown(0.5)
      .fontSize(14)
      .text('Cotización:', { underline: true, lineGap: 2 })
      .moveDown(0.2);

    //Limpieza y agregado del cuerpo de la cotización
    const cotClean = cotizacion
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\r/g, '')
      .replace(/[ \t]+$/gm, '');

    doc
      .fontSize(12)
      .text(cotClean, {
        align: 'justify',
        lineGap: 4,
        paragraphGap: 6,
        indent: 20
      });

    //Mensaje final
    doc
      .moveDown(0.5)
      .fontSize(12)
      .text('¡Gracias por su preferencia!', { align: 'center', lineGap: 2 });

    doc.end();
  } catch (err) {
    console.error('Error generando cotización:', err.message);
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

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cotizacion_${quote._id}.pdf"`);
    doc.pipe(res);

    doc
      .fontSize(18)
      .text('Cotización generada por IA', { align: 'center' })
      .moveDown()
      .fontSize(12)
      .text(`Cliente: ${quote.cliente}`)
      .text(`Correo: ${quote.email}`)
      .text(`Requerimiento: ${quote.requerimiento}`)
      .moveDown()
      .text('Cotización:', { underline: true })
      .moveDown()
      .text(quote.cotizacion);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generando PDF' });
  }
});

module.exports = router;
