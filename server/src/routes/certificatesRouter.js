const express = require('express');
const certificatesController = require('../controllers/certificatesController');

const router = express.Router();

router.get('/:certificateId', certificatesController.verify);

module.exports = router;
