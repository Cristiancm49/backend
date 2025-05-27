const mongoose = require('mongoose');

const ArchivoSchema = new mongoose.Schema({
  idProyecto: {
    type: String,
    required: true
  },
  nombre: String,
  tipo: String,
  contenido: Buffer,
  extension: String,
  fechaSubida: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Archivo', ArchivoSchema);
