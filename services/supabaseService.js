// services/supabaseService.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Función para obtener un paciente por su ID
async function obtenerPacientePorId(id) {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('❌ Error al consultar paciente en Supabase:', error);
    return null;
  }

  return data;
}

module.exports = {
  obtenerPacientePorId,
};
