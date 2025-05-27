const express = require('express');
const routes = express.Router();

const historialController = require('../controllers/historialControlador');

routes.get('/:idProyecto', historialController.getHistorialProyecto);

module.exports = routes;
