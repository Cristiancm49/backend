const mongoose = require('mongoose');

const FotoPerfilSchema = new mongoose.Schema({
  idUsuario: {
    type: Number,
    required: true,
    unique: true
  },
  nombreArchivo: String,
  contentType: String,
  data: Buffer,
  fechaSubida: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FotoPerfil', FotoPerfilSchema);
