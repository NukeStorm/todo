/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const cors = require('cors');

router.use(
  cors({
    credentials: true,
  }),
);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('todo.html');
});

module.exports = router;
