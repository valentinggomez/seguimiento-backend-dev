// services/sheetsService.js
const { google } = require('googleapis');
global.Headers = require('node-fetch').Headers; // <--- Agregá esta línea
require('dotenv').config();


async function guardarEnSheets(fila) {
  try {
    // Crear auth con cuenta de servicio
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Agregar la fila al final de la hoja
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Respuestas!A1', // Asegurate de tener una hoja llamada "Respuestas"
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [fila],
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al guardar en Google Sheets:', error);
    throw error;
  }
}

module.exports = { guardarEnSheets };
