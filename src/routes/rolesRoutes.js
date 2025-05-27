const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

router.get('/getRoles', rolesController.getRoles);
router.post('/createRol', rolesController.createRol);
router.put('/updateRol/:id', rolesController.updateRol);
router.delete('/deleteRol/:id', rolesController.deleteRol);

module.exports = router;
