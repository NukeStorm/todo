var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/api/user", function (req, res, next) {
  res.json({ data: { user: "hello", pw: "test" } });
});

module.exports = router;
