/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'test' });
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('todo.html', { title: 'test' });
});

module.exports = router;
