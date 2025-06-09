// routes/respuestas.js
const express = require('express');
const router = express.Router();
const { obtenerPacientePorId } = require('../services/supabaseService');
const { guardarEnSheets } = require('../services/sheetsService');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function convertirABooleano(valor) {
  if (valor === 'Sí') return true;
  if (valor === 'No') return false;
  return null;
}

async function guardarRespuestaEnSupabase(paciente_id, respuestas) {
  const { error } = await supabase.from('respuestas_postop').insert({
    paciente_id,
    dolor_6h: respuestas[0],
    dolor_24h: respuestas[1],
    dolor_mayor_7: convertirABooleano(respuestas[2]),
    nauseas: convertirABooleano(respuestas[3]),
    vomitos: convertirABooleano(respuestas[4]),
    somnolencia: convertirABooleano(respuestas[5]),
    medicacion_adicional: respuestas[6],
    desperto_por_dolor: convertirABooleano(respuestas[7]),
    satisfaccion: respuestas[8],
    horas_movilidad: respuestas[9],
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
      paciente.edad || '',
      paciente.sexo || '',
      paciente.peso || '',
      paciente.altura || '',
      paciente.imc || '',
      paciente.telefono || '',
      paciente.cirugia || '',
      paciente.fecha_cirugia || '',
      respuestas[0] || '',
      respuestas[1] || '',
      respuestas[2] || '',
      respuestas[3] || '',
      respuestas[4] || '',
      respuestas[5] || '',
      respuestas[6] || '',
      respuestas[7] || '',
      respuestas[8] || '',
      respuestas[9] || '',
      respuestas[10] || '',
      new Date().toLocaleString('es-AR'),
      paciente.bloqueo || '',
      paciente.dosis_ketorolac || '',
      paciente.dosis_dexametasona || '',
      paciente.dosis_dexmedetomidina || '',
      paciente.dosis_ketamina || '',
      paciente.esquema_analgesico || '',
      paciente.paracetamol_previo || '',
      paciente.nombre_medico || ''
    ];

    console.log('📤 Enviando a Sheets:', fila);
    await guardarEnSheets(fila);
    console.log('✅ Guardado en Sheets correctamente');

    res.status(200).json({ success: true, mensaje: 'Guardado en Supabase y Sheets' });
  } catch (error) {
    console.error('❌ Error al procesar la respuesta:', error);
    res.status(500).json({ success: false, error: error.message || 'Error interno del servidor' });
  }
});

module.exports = router;
