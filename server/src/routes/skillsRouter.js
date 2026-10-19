const express = require('express');
const skillsController = require('../controllers/skillsController');

const router = express.Router();

router.get('/', skillsController.list);
router.get('/:id', skillsController.getById);

module.exports = router;
