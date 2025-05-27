const pool = require('../config/db');

const proyectoController = {

    getDocentes: async (req, res) => {
        try {
          const result = await pool.query(
            `SELECT idusuario, nombre, apellidos FROM usuario WHERE idrol = 2`
          );
          res.json(result.rows);
        } catch (error) {
          console.error('Error al obtener docentes:', error);
          res.status(500).json({ message: 'Error al obtener docentes.' });
        }
      },

    getProyectos: async (req, res) => {
        try {

            const result = await pool.query(`
	  SELECT 
  p.*,
  ep.nombre AS estado_actual,
  i.nombre AS nombre_institucion,
  u.nombre || ' ' || u.apellidos AS creador
FROM proyecto p
JOIN institucion i ON i.idinstitucion = p.idinstitucion
JOIN usuario u ON u.idusuario = p.idusuariocreador
LEFT JOIN (
  SELECT DISTINCT ON (idProyecto) idProyecto, idEstadoProyecto
  FROM historialEstado
  ORDER BY idProyecto, fechaCambio DESC
) he ON he.idProyecto = p.idproyecto
LEFT JOIN estadoProyecto ep ON ep.idEstadoProyecto = he.idEstadoProyecto
`);
            res.json(result.rows);

        } catch (error) {
            console.error('Error al obtener proyectos:', error);
            res.status(500).json({ message: 'Error al obtener proyectos.' });
        }
    },
    getProyectoById: async (req, res) => {

        const { id } = req.params;

        try {

            const result = await pool.query(`SELECT * FROM proyecto WHERE idproyecto = $1`, [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Proyecto no encontrado.' });
            }
            res.json(result.rows[0]);

        } catch (error) {
            console.error('Error al obtener proyecto por ID:', error);
            res.status(500).json({ message: 'Error al obtener proyecto por ID.' });

        }
    },

    createProyecto: async (req, res) => {
        const {
            nombre,
            descripcion,
            objetivos,
            cronograma,
            observaciones,
            fechaInicio,
            fechaFin,
            idInstitucion,
            idUsuarioCreador
        } = req.body;

        try {
            const result = await pool.query(
                `INSERT INTO proyecto (
                    nombre, 
                    descripcion, 
                    objetivos, 
                    cronograma, 
                    observaciones, 
                    fechaInicio, 
                    fechaFin, 
                    idInstitucion,
                    idUsuarioCreador
                        ) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                        RETURNING *;`,
                [
                    nombre,
                    descripcion,
                    objetivos,
                    cronograma,
                    observaciones,
                    fechaInicio,
                    fechaFin,
                    idInstitucion,
                    idUsuarioCreador]
            );
            res.status(201).json({
                mensaje: 'Proyecto creado exitosamente.',
                proyecto: result.rows[0]
            });
        } catch (error) {
            console.error('Error al crear proyecto:', error);
            res.status(500).json({ message: 'Error al crear proyecto.' });
        }
    },
    updateProyecto: async (req, res) => {
        const { id } = req.params;
        const {
            nombre,
            descripcion,
            objetivos,
            cronograma,
            observaciones,
            fechaInicio,
            fechaFin,
            idInstitucion,
        } = req.body;


        try {
            const result = await pool.query(
                `UPDATE proyecto SET 
                nombre = $1, 
                descripcion = $2, 
                objetivos = $3, 
                cronograma = $4, 
                observaciones = $5, 
                fechaInicio = $6, 
                fechaFin = $7, 
                idInstitucion = $8 
                WHERE idproyecto = $9 RETURNING *`,
                [
                    nombre,
                    descripcion,
                    objetivos,
                    cronograma,
                    observaciones,
                    fechaInicio,
                    fechaFin,
                    idInstitucion,
                    id,
                ]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'Proyecto no encontrado para actualizar.'
                });
            }
            res.json({
                mensaje: 'Proyecto actualizado exitosamente.',
                proyecto: result.rows[0]
            });
        } catch (error) {
            console.error('Error al actualizar proyecto:', error);
            res.status(500).json({
                message: 'Error al actualizar proyecto.'
            });
        }
    },
    getProyectosByInstitucion: async (req, res) => {
        const { idInstitucion } = req.params;
        try {
            const result = await pool.query(`SELECT * FROM 
                proyecto WHERE idInstitucion = $1`,
                [idInstitucion]);
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'No se encontraron proyectos para esta institución.'
                });
            }
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener proyectos por institución:', error);
            res.status(500).json({
                message: 'Error al obtener proyectos por institución.'
            });
        }
    },


    getProyectosByUsuario: async (req, res) => {
        const idUsuario = parseInt(req.params.id, 10);

        try {
            const result = await pool.query(`
            SELECT 
  p.idproyecto,
  p.nombre,
  p.descripcion,
  p.objetivos,
  p.cronograma,
  p.observaciones,
  p.fechainicio,
  p.fechafin,
  p.fechacreacion,
  i.nombre AS nombre_institucion,
  ep.nombre AS estado_actual
FROM proyecto p
JOIN institucion i ON p.idinstitucion = i.idinstitucion
LEFT JOIN (
  SELECT DISTINCT ON (he.idproyecto)
    he.idproyecto,
    ep2.nombre AS nombre  -- aquí alias correcto
  FROM historialestado he
  JOIN estadoproyecto ep2 ON he.idestadoproyecto = ep2.idestadoproyecto
  ORDER BY he.idproyecto, he.fechacambio DESC
) ep ON p.idproyecto = ep.idproyecto
WHERE p.idusuariocreador = $1
ORDER BY p.fechacreacion DESC;

          `, [idUsuario]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'No se encontraron proyectos para este usuario.' });
            }

            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener proyectos por usuario:', error);
            res.status(500).json({ message: 'Error al obtener proyectos por usuario.' });
        }
    },

    cambiarEstadoProyecto: async (req, res) => {
        const { idProyecto, idEstadoProyecto } = req.body;

        if (!idProyecto || !idEstadoProyecto) {
            return res.status(400).json({ message: 'Faltan campos obligatorios.' });
        }

        try {
            const result = await pool.query(
                `INSERT INTO historialestado (idproyecto, idestadoproyecto)
             VALUES ($1, $2)
             RETURNING *`,
                [idProyecto, idEstadoProyecto]
            );

            res.status(200).json({
                message: 'Estado actualizado correctamente',
                historial: result.rows[0]
            });
        } catch (error) {
            console.error('Error al cambiar estado del proyecto:', error);
            res.status(500).json({ message: 'Error al cambiar el estado del proyecto.' });
        }
    },
    getProyectoExtendido: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query(
                `SELECT 
                    p.idproyecto,
                    p.nombre,
                    p.descripcion,
                    p.objetivos,
                    p.cronograma,
                    p.observaciones,
                    p.fechainicio,
                    p.fechafin,
                    p.fechacreacion,
                    i.idinstitucion,
                    i.nombre AS nombre_institucion,
                    u.nombre || ' ' || u.apellidos AS creador,
                    ep.nombre AS estado_actual
                    FROM proyecto p
                    JOIN institucion i ON p.idinstitucion = i.idinstitucion
                    JOIN usuario u ON p.idusuariocreador = u.idusuario
                    LEFT JOIN (
                    SELECT DISTINCT ON (he.idproyecto)
                        he.idproyecto,
                        ep2.nombre
                    FROM historialestado he
                    JOIN estadoproyecto ep2 ON he.idestadoproyecto = ep2.idestadoproyecto
                    ORDER BY he.idproyecto, he.fechacambio DESC
                    ) ep ON p.idproyecto = ep.idproyecto
                    WHERE p.idproyecto = $1;
                    `,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Proyecto no encontrado.' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener proyecto extendido:', error);
            res.status(500).json({ message: 'Error al obtener el proyecto.' });
        }
    },
    eliminarProyecto: async (req, res) => {
        const { id } = req.params;
        try {
            await pool.query(`DELETE FROM proyecto WHERE idproyecto = $1`, [id]);
            res.status(200).json({ message: 'Proyecto eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
            res.status(500).json({ message: 'Error al eliminar proyecto' });
        }
    }
};

module.exports = proyectoController;