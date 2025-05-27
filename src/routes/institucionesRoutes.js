const express = require('express');
const router = express.Router();
const institucionesController = require('../controllers/institucionesController');

router.get('/getInstituciones', institucionesController.getInstituciones);
router.get('/getInstitucion/:id', institucionesController.getInstitucionesById);
router.post('/createInstitucion', institucionesController.createInstitucion);
router.put('/updateInstitucion/:id', institucionesController.updateInstitucion);
router.delete('/deleteInstitucion/:id', institucionesController.eliminarInstitucion);

module.exports = router;