const pool = require('../config/db');

const institucionesController = {
    getInstituciones: async (req, res) => {
        try {
            const result = await pool.query(`SELECT * FROM institucion`);
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener instituciones:', error);
            res.status(500).json({ message: 'Error al obtener instituciones.' });
        }

    },
    getInstitucionesById: async (req, res) => {

        const { id } = req.params;

        try {

            const result = await pool.query(` SELECT * FROM INSTITUCION WHERE idinstitucion = $1`, [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Institución no encontrada.' });
            }
            res.json(result.rows[0]);


        } catch (error) {
            console.error('error al obetener instituciones:', error);
            res.status(500).json({ message: 'error al obtener instituciones.' });
        }
    },
    updateInstitucion: async (req, res) => {
        const { id } = req.params;
        const { nombre, direccion, telefono, email, ciudad } = req.body;
        try {
            const result = await pool.query(`UPDATE institucion SET
                 nombre = $1,
                direccion = $2,
                telefono = $3,
                email = $4,
                ciudad = $5
                WHERE idinstitucion = $6 RETURNING *`, [nombre, direccion, telefono, email, ciudad, id]);
            res.json({
                mensaje: 'Institución actualizada exitosamente.',
                institucion: result.rows[0]
            })
        } catch (error) {
            console.error('Error al actualizar institución:', error);
            res.status(500).json({ message: 'Error al actualizar institución.' });
        }
    },
    createInstitucion: async (req, res) => {

        const { nombre, direccion, telefono, correo, ciudad } = req.body;

        try {
            const result = await pool.query(`insert into institucion(
                nombre, 
                direccion, 
                telefono, 
                email, 
                ciudad)
                values($1, $2, $3, $4, $5) RETURNING *`, [nombre, direccion, telefono, correo, ciudad]);
                res.status(201).json({
                    mensaje: 'Institución registrada exitosamente.',
                    institucion: result.rows[0]
                });
            
        } catch (error) {
            console.error('Error al crear institución:', error);
            res.status(500).json({ message: 'Error al crear institución.' });
        }

    },
    eliminarInstitucion: async (req, res) => {
        const { id } = req.params;
        try {
          await pool.query('DELETE FROM institucion WHERE idInstitucion = $1', [id]);
          res.status(200).json({ mensaje: 'Institución eliminada correctamente' });
        } catch (error) {
          console.error('Error al eliminar institución:', error);
          res.status(500).json({ error: 'Error al eliminar institución' });
        }
    }
}

module.exports = institucionesController;