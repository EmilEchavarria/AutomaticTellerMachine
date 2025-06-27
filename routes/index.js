// routes/index.js
import express from 'express';
import { procesarRetiro } from '../controllers/atmController.js';

const router = express.Router();

// Historial en memoria
const historial = [];

// --- Página principal con formulario y resultados ---
router.get('/', (req, res) => {
  res.render('home', {
    titulo: 'Simulador de Cajero Automático',
    historial,
  });
});

// --- Procesar retiro POST ---
router.post('/retirar', (req, res) => {
  const { monto, modo } = req.body;
  const valorMonto = parseInt(monto);

  // Llamada a la lógica del cajero
  const resultado = procesarRetiro(valorMonto, modo);

  // Si exitoso, actualizamos historial
  if (resultado.exito) {
    historial.unshift({
      fecha: new Date().toISOString(),
      monto: valorMonto,
      modo,
      distribucion: resultado.distribucion,
    });
  }

  res.render('home', {
    titulo: 'Simulador de Cajero Automático',
    resultado,
    historial,
  });
});

// --- Endpoint para limpiar historial ---
router.post('/limpiar-historial', (req, res) => {
  historial.splice(0, historial.length);
  res.redirect('/');
});

// --- Endpoint para exportar historial en JSON ---
router.get('/exportar-historial', (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename=historial_retiros.json');
  res.json(historial);
});

// --- Endpoint para ver estadísticas resumidas ---
router.get('/estadisticas', (req, res) => {
  res.render('estadisticas', { titulo: 'Estadísticas del Cajero' });
});

export default router;
