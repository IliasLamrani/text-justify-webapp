const express = require('express');
const fs = require('fs');
const justifyText = require('./modules/justify-text');

const app = express();
app.use(express.text());


const maxLineLength = 80;
const fileName = "./tmp"
const encoding = "utf8"

//TODO: use try - catch - throw

app.post('/api/justify', (req, res) => {
    justifyText(fileName, req.body, maxLineLength);
    const data = fs.readFileSync(fileName, encoding);
    res.status(200).send(data);
    fs.unlink('./tmp', err => console.log(err));
})

app.listen(3000);