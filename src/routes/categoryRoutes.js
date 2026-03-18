const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();

router.get('/search', CategoryController.search);
router.get('/:id', CategoryController.getById);
router.post('/', CategoryController.create);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

module.exports = router;