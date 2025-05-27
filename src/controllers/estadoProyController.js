const pool = require('../config/db');

const estadoProyController = {
    getEstadoProy: async (req, res) => {
        try {

            const result  = await pool.query(`select * from estadoproyecto`);
            res.json(result.rows);
            
        } catch (error) {
            console.error('Error al obtener estados de proyecto:', error);
            res.status(500).json({ message: 'Error al obtener estados de proyecto.' });
            
        }
    },
    getEstadoProyById: async (req, res) => {
        const { id } = req.params;

        try {
            const result = await pool.query(`select * from estadoproyecto where idestadoproyecto = $1`, [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Estado de proyecto no encontrado.' });
            }
            res.json(result.rows[0]);
            
        } catch (error) {
            console.error('Error al obtener estado de proyecto por ID:', error);
            res.status(500).json({ message: 'Error al obtener estado de proyecto por ID.' });
            
        }
    },
    updateEstadoProy: async (req, res) => {
        
        const { id } = req.params;
        const {nombre} = req.body;
        const data = req.body;

        try {
            console.log(data);
            const result = await pool.query(`UPDATE estadoproyecto SET 
                nombre = $1
                WHERE idestadoproyecto = $2 RETURNING *`, [nombre, id]);
                res.json({
                    mensaje: 'Estado de proyecto actualizado exitosamente.',
                    estadoProyecto: result.rows[0]
                });
            
            
        } catch (error) {
            console.error('Error al actualizar estado de proyecto:', error);
            res.status(500).json({ message: 'Error al actualizar estado de proyecto.' });
            
        }
    },
    createEstadoProy: async (req, res) => {

        const { nombre } = req.body;

        try {
            const result = await pool.query(`insert into estadoproyecto(nombre) values ($1) returning *`, [nombre]);
            res.status(201).json({
                mensaje: 'Estado creado correctamente.',
                estadoProyecto: result.rows[0]
            })
            
        } catch (error) {
            console.error('Error al crear estado de proyecto:', error);
            res.status(500).json({ message: 'Error al crear estado de proyecto.' });
            
        }
    }
}

module.exports = estadoProyController;