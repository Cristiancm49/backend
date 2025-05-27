const express = require('express');
const routes = express.Router();

const estudiantesController = require('../controllers/estudiantesController');

routes.get('/getEstudiantes', estudiantesController.getEstudiantes);
routes.get('/getEstudiante/:id', estudiantesController.getEstudianteById);
routes.get('/:id/proyectos', estudiantesController.obtenerProyectosAsignados);


module.exports = routes;