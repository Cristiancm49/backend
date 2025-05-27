const express = require('express');
const routes = express.Router();

const proyectosController = require('../controllers/proyectosController');

routes.get('/getProyectos', proyectosController.getProyectos);
routes.get('/getProyecto/:id', proyectosController.getProyectoById);
routes.post('/createProyecto', proyectosController.createProyecto);
routes.put('/updateProyecto/:id', proyectosController.updateProyecto);
routes.get('/getProyectos/institucion/:id', proyectosController.getProyectosByInstitucion);
routes.get('/getProyectos/usuario/:id', proyectosController.getProyectosByUsuario);
routes.post('/actualizarEstadoProyecto', proyectosController.cambiarEstadoProyecto);
routes.get('/getProyectoExtendido/:id', proyectosController.getProyectoExtendido);
routes.delete('/deleteProyecto/:id', proyectosController.eliminarProyecto);
routes.get('/getDocentes', proyectosController.getDocentes);



module.exports = routes;
