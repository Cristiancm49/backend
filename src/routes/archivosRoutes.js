const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/archivoController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.array('archivos', 10), controller.subirArchivos);
router.get('/proyecto/:idProyecto', controller.listarPorProyecto);
router.get('/:id', controller.obtenerArchivo);
router.delete('/:id', controller.eliminarArchivo);

module.exports = router;
