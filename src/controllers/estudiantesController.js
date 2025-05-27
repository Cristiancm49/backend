const pool = require('../config/db');

const estudiantesController = {

    getEstudiantes: async (req, res) => {
        try {
            // Consulta para obtener todos los usuarios con el rol de 'Estudiante'
            const result = await pool.query(`
                SELECT u.idusuario, u.nombre, u.apellidos, u.email, r.nombre as rol
                FROM usuario u
                JOIN rol r ON u.idrol = r.idrol
                WHERE r.nombre = 'Estudiante'
            `);
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
            res.status(500).json({ message: 'Error al obtener estudiantes.' });
        }
    },

    obtenerProyectosAsignados: async (req, res) => {
        const { id } = req.params;

        try {
            const result = await pool.query(
                `SELECT 
  p.idProyecto,
  p.nombre AS nombre_proyecto,
  p.descripcion,
  p.fechaInicio,
  p.fechaFin,
  i.nombre AS nombre_institucion,
  u.nombre || ' ' || u.apellidos AS creador,
  ep.nombre AS estado_actual
FROM proyectoEstudiantes pe
JOIN proyecto p ON pe.idProyecto = p.idProyecto
JOIN institucion i ON p.idInstitucion = i.idInstitucion
JOIN usuario u ON p.idUsuarioCreador = u.idUsuario
JOIN (
    SELECT DISTINCT ON (idProyecto) idProyecto, idEstadoProyecto
    FROM historialEstado
    ORDER BY idProyecto, fechaCambio DESC
) he ON p.idProyecto = he.idProyecto
JOIN estadoProyecto ep ON he.idEstadoProyecto = ep.idEstadoProyecto
WHERE pe.idUsuario = $1;`,
                [id]
            );

            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener proyectos del estudiante:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },


    getEstudianteById: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query(`
                SELECT u.idusuario, u.nombre, u.apellidos, u.email, r.nombre as rol
                FROM usuario u
                JOIN rol r ON u.idrol = r.idrol
                WHERE r.nombre = 'Estudiante' AND u.idusuario = $1
            `, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Estudiante no encontrado.' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener estudiante por ID:', error);
            res.status(500).json({ message: 'Error al obtener estudiante por ID.' });
        }
    }
};

module.exports = estudiantesController;
