const express = require('express');
const path = require('path');

const app = express();

const PORT = 3000;

app.use(express.static('datas'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

const server = app.listen(PORT, console.log(`server running on port 3000`));

