const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioControllers');

router.get('/getUsuarios', usuarioController.getUsuarios);
router.get('/getUsuario/:id', usuarioController.getUsuarioById);
router.post('/createUsuario/', usuarioController.createUsuario);
router.put('/updateUsuarios/:id', usuarioController.updateUsuario);
router.delete('/deleteUsuario/:id', usuarioController.deleteUsuario);

module.exports = router;
