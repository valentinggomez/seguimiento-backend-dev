// routes/respuestas.js
const express = require('express');
const router = express.Router();
const { obtenerPacientePorId } = require('../services/supabaseService');
const { guardarEnSheets } = require('../services/sheetsService');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function guardarRespuestaEnSupabase(paciente_id, respuestas) {
  const { error } = await supabase.from('respuestas_postop').insert({
    paciente_id,
    dolor_6h: respuestas[0],
    dolor_24h: respuestas[1],
    dolor_mayor_7: respuestas[2],
    nauseas: respuestas[3],
    vomitos: respuestas[4],
    somnolencia: respuestas[5],
    medicacion_adicional: respuestas[6],
    desperto_por_dolor: respuestas[7],
    quiere_seguimiento: respuestas[8],
    satisfaccion: respuestas[9],
    observaciones: respuestas[10],
    fecha_respuesta: new Date().toISOString()
  });

  if (error) {
    console.error('❌ Error al guardar en Supabase:', error);
    throw error;
  } else {
    console.log('✅ Guardado en Supabase correctamente');
  }
}


router.post('/', async (req, res) => {
  try {
    const { paciente_id, respuestas } = req.body;
    console.log('📥 Datos recibidos:', req.body);

    if (!paciente_id || !respuestas) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const paciente = await obtenerPacientePorId(paciente_id);
    console.log('🔎 Paciente encontrado:', paciente);

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    await guardarRespuestaEnSupabase(paciente.id, respuestas);

    const fila = [
        paciente.id,
        paciente.nombre || '',
        paciente.dni || '',
        paciente.telefono || '',
        paciente.cirugia || '',
        new Date().toLocaleString('es-AR'), // Fecha de cirugía
        respuestas[0] || '', // Dolor 6h
        respuestas[1] || '', // Dolor 24h
        respuestas[2] || '', // Dolor > 7
        respuestas[3] || '', // Náuseas
        respuestas[4] || '', // Vómitos
        respuestas[5] || '', // Somnolencia
        respuestas[6] || '', // Medicación adicional
        respuestas[7] || '', // Despertó por dolor
        respuestas[8] || '', // Quiere seguimiento
        respuestas[9] || '', // Satisfacción
        respuestas[10] || '', // Observaciones
        new Date().toLocaleString('es-AR') // Fecha de respuesta
    ];

    console.log('📤 Enviando a Sheets:', fila);
    await guardarEnSheets(fila);
    console.log('✅ Guardado en Sheets correctamente');

    res.status(200).json({ mensaje: 'Respuesta guardada correctamente ✅' });
  } catch (error) {
    console.error('❌ Error al procesar la respuesta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
