const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../public')));

const port = process.env_PORT || 3000;
app.listen(port , () => console.log(`listening on port ${port}`));