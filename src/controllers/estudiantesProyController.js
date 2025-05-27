const pool = require('../config/db');

const estudiantesProyController = {

    getEstudiantesPorProyecto: async (req, res) => {
    const { idProyecto } = req.params;
    try {
      const result = await pool.query(`
        SELECT u.idusuario, u.nombre, u.apellidos, u.email
        FROM proyectoestudiantes pe
        JOIN usuario u ON pe.idusuario = u.idusuario
        WHERE pe.idproyecto = $1
      `, [idProyecto]);

      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener estudiantes del proyecto:', error);
      res.status(500).json({ message: 'Error al obtener estudiantes del proyecto' });
    }
  },


  asignarEstudiantes: async (req, res) => {
    const { idProyecto } = req.params;
    const { estudiantes } = req.body;

    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
      return res.status(400).json({ message: 'Debes enviar una lista de estudiantes' });
    }

    try {
      for (const idUsuario of estudiantes) {
        await pool.query(
          `INSERT INTO proyectoestudiantes (idproyecto, idusuario)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [idProyecto, idUsuario]
        );
      }

      res.status(201).json({ message: 'Estudiantes asignados correctamente.' });
    } catch (error) {
      console.error('Error al asignar estudiantes:', error);
      res.status(500).json({ message: 'Error al asignar estudiantes al proyecto' });
    }
  },


  eliminarEstudiante: async (req, res) => {
    const { idProyecto, idUsuario } = req.params;
    try {
      await pool.query(
        `DELETE FROM proyectoestudiantes WHERE idproyecto = $1 AND idusuario = $2`,
        [idProyecto, idUsuario]
      );
      res.json({ message: 'Estudiante eliminado del proyecto.' });
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      res.status(500).json({ message: 'Error al eliminar estudiante del proyecto' });
    }
  }
};

module.exports = estudiantesProyController;


