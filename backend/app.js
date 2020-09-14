const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');

//basic setting
const port = process.env.PORT || 3000;
const app = express();
app.locals.pretty = true;

//templete engine
app.set('view engine', 'ejs');
app.set('views', './views');

//middleware
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//routing
app.use(router);

//server on
app.listen(port, '0.0.0.0', () => {
  console.log(`The server is running on http://localhost:${port}`);
});

module.exports = app;
