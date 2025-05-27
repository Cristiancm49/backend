const FotoPerfil = require('../models/FotoPerfil');

const fotoPerfilController = {
  subirFoto: async (req, res) => {
    try {
      const { idUsuario } = req.body;
      const { buffer, originalname, mimetype } = req.file;

      // Reemplazar si ya existe una
      await FotoPerfil.findOneAndDelete({ idUsuario });

      const nuevaFoto = new FotoPerfil({
        idUsuario,
        nombreArchivo: originalname,
        contentType: mimetype,
        data: buffer
      });

      await nuevaFoto.save();

      res.status(201).json({ message: 'Foto subida correctamente' });
    } catch (error) {
      console.error('Error al subir foto:', error);
      res.status(500).json({ message: 'Error interno' });
    }
  },

  obtenerFoto: async (req, res) => {
    try {
      const { idUsuario } = req.params;
      const foto = await FotoPerfil.findOne({ idUsuario });

      if (!foto) return res.status(404).json({ message: 'Foto no encontrada' });

      res.set('Content-Type', foto.contentType);
      res.send(foto.data);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener foto' });
    }
  }
};

module.exports = fotoPerfilController;
