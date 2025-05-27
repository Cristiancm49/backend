const express = require('express');
const router = express.Router();
const estadoProyController = require('../controllers/estadoProyController');

router.get('/getEstadosProy', estadoProyController.getEstadoProy);
router.get('/getEstadoProyById/:id', estadoProyController.getEstadoProyById);
router.put('/updateEstadoProy/:id', estadoProyController.updateEstadoProy);
router.post('/createEstadoProy', estadoProyController.createEstadoProy);

module.exports = router;