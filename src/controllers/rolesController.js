const pool = require('../config/db');

const rolesController = {
  getRoles: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM rol ORDER BY idrol');
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener roles:', err);
      res.status(500).json({ message: 'Error al obtener roles' });
    }
  },

  createRol: async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ message: 'Nombre es requerido' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO rol (nombre) VALUES ($1) RETURNING *',
        [nombre]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al crear rol:', err);
      res.status(500).json({ message: 'Error al crear rol' });
    }
  },

  updateRol: async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
      const result = await pool.query(
        'UPDATE rol SET nombre = $1 WHERE idrol = $2 RETURNING *',
        [nombre, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error al actualizar rol:', err);
      res.status(500).json({ message: 'Error al actualizar rol' });
    }
  },

  deleteRol: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query('DELETE FROM rol WHERE idrol = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }

      res.json({ message: 'Rol eliminado correctamente' });
    } catch (err) {
      console.error('Error al eliminar rol:', err);
      res.status(500).json({ message: 'Error al eliminar rol' });
    }
  }
};

module.exports = rolesController;
