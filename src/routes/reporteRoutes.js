const express = require('express');
const router = express.Router();

const reporteController = require('../controllers/reporteController');

router.get('/getReporte/:id', reporteController.getReportes);

module.exports = router;