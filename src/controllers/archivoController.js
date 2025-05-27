const Archivo = require('../models/archivo');

const archivoController = {
  subirArchivos: async (req, res) => {
    try {
      const archivosGuardados = [];

      for (const file of req.files) {
        const archivo = new Archivo({
          idProyecto: req.body.idProyecto,
          nombre: file.originalname,
          tipo: file.mimetype,
          contenido: file.buffer,
          extension: file.originalname.split('.').pop()
        });

        const guardado = await archivo.save();
        archivosGuardados.push({
          id: guardado._id,
          nombre: guardado.nombre
        });
      }

      res.status(201).json({
        message: 'Archivos subidos exitosamente',
        archivos: archivosGuardados
      });
    } catch (error) {
      console.error('Error al subir archivos:', error);
      res.status(500).json({ message: 'Error al subir archivos' });
    }
  },

  listarPorProyecto: async (req, res) => {
    try {
      const archivos = await Archivo.find({ idProyecto: req.params.idProyecto });
      if (archivos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron archivos para este proyecto' });
      }

      res.json(archivos.map(a => ({
        id: a._id,
        nombre: a.nombre,
        tipo: a.tipo,
        extension: a.extension,
        fechaSubida: a.fechaSubida
      })));
    } catch (error) {
      console.error('Error al obtener archivos:', error);
      res.status(500).json({ message: 'Error al obtener archivos' });
    }
  },

  obtenerArchivo: async (req, res) => {
    try {
      const archivo = await Archivo.findById(req.params.id);
      if (!archivo) {
        return res.status(404).json({ message: 'Archivo no encontrado' });
      }

      res.set('Content-Type', archivo.tipo);
      res.send(archivo.contenido);
    } catch (error) {
      console.error('Error al obtener archivo:', error);
      res.status(500).json({ message: 'Error al obtener archivo' });
    }
  },

  eliminarArchivo: async (req, res) => {
    try {
      const eliminado = await Archivo.findByIdAndDelete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ message: 'Archivo no encontrado para eliminar' });
      }

      res.json({ message: 'Archivo eliminado correctamente', id: eliminado._id });
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      res.status(500).json({ message: 'Error al eliminar archivo' });
    }
  }
};

module.exports = archivoController;
