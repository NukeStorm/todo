const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors());

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
//application/json
app.use(bodyParser.json({limit:"50mb"}));
app.use(cookieParser());

//=================routing==================
app.use('/user',require('./routes/login'));


app.listen(port, () => console.log("Express server listening on port %d in %s mode",  port,app.settings.env));