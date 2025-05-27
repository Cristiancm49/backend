const pool = require('../config/db');

exports.getHistorialProyecto = async (req, res) => {
    const { idProyecto } = req.params;
    try {
      const { rows } = await pool.query(
        `SELECT 
          he.idHistorialEstado,
          he.fechaCambio,
          ep.nombre AS nombre_estado
        FROM historialestado he
        JOIN estadoproyecto ep ON he.idEstadoProyecto = ep.idEstadoProyecto
        WHERE he.idProyecto = $1
        ORDER BY he.fechaCambio DESC`,
        [idProyecto]
      );
  
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({ error: 'Error al obtener historial' });
    }
  };
  