const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController');
const validateBug = require('../middleware/validateBug');

router.get('/', bugController.getAllBugs);
router.get('/:id', bugController.getBugById);
router.post('/', validateBug, bugController.createBug);
router.put('/:id', validateBug, bugController.updateBug);
router.delete('/:id', bugController.deleteBug);

module.exports = router;