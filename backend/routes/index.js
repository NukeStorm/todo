const express = require('express');
const controller = require('../controllers/indexController');

const router = express.Router();

router.get('/', controller.getIndex);

router.use((_req, res) => res.status(404).send(`<h1>Page Not Found</h1>`));

module.exports = router;
