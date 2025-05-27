const express = require('express');
const router = express.Router();
const controller = require('../controllers/estudiantesProyController');

// Obtener estudiantes por proyecto
router.get('/estudiantes/:idProyecto', controller.getEstudiantesPorProyecto);

// Asignar estudiantes nuevos (agrega sin borrar los anteriores)
router.post('/estudiantes/:idProyecto', controller.asignarEstudiantes);

// Reemplazar completamente la lista de estudiantes
router.delete('/estudiantes/:idProyecto/:idUsuario', controller.eliminarEstudiante);

module.exports = router;
