const express = require('express');
const router = express.Router();
const multer = require('multer');
const fotoPerfilController = require('../controllers/fotoPerfilController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/subir', upload.single('foto'), fotoPerfilController.subirFoto);
router.get('/:idUsuario', fotoPerfilController.obtenerFoto);

module.exports = router;
