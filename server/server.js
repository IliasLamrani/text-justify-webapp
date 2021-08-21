const express = require('express');
const fs = require('fs');
const justifyText = require('./modules/justify-text');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

app.use(express.text());
app.use(express.json());

const maxLineLength = 80;
const maxFreeWords = 80000;
const fileName = "./tmp"
const encoding = "utf8"

const users = [];

app.get('/', (req, res) => {
    res.send("Welcome to the justify-text API. For more infos, and to learn how to use it, please use the following link: https://github.com/Shelyp/text-justify-API")
})

function authenticationMiddleware(req, res, next) {
    // the authorization header type for jwt should be 'Bearer'
    // https://stackoverflow.com/questions/33265812/best-http-authorization-header-type-for-jwt
    // so it will look like this -> Authorization: Bearer <token>
    const header = req.headers['authorization'];
    if (header) {
        const userToken = header.split(' ')[1];
        jwt.verify(userToken, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                res.status(403).send('Invalid token');
                return;
            }
            req.user = user;
            next();
        })
    } else {
        res.status(401).send('Please provide your token');
    }
}

app.post('/api/justify', authenticationMiddleware, (req, res) => {
    if (users[req.user.id].wordsJustifiedInDay + req.body.length > maxFreeWords) {
        res.status(402).send('Payment required!');
    } else {
        try {
            justifyText(fileName, req.body, maxLineLength);
            const data = fs.readFileSync(fileName, encoding);
            res.status(200).send(data);

            fs.unlink(fileName, err => { //we don't need the output file anymore
                if (err)
                    console.log(err);
            });

            users[req.user.id].wordsJustifiedInDay += req.body.length;
        } catch {
            res.status(500).send("Can't justify given text.");
        }
    }
})

app.post('/api/token', async (req, res) => {
    if (!req.body.email) {
        res.status(400).send("Please provide an email");
    }
    else if (!req.body.password) {
        res.status(400).send("Please provide a password");
    } else {
        try {
            if (users.find(user => user.email === req.body.email)) {
                return res.status(500).send('You already have an account!');
            }
            //hash user password and save his infos:
            let salt = await bcrypt.genSalt();
            let pwd = await bcrypt.hash(req.body.password, salt);

            users.push({
                id: users.length,
                email: req.body.email,
                password: pwd,
                wordsJustifiedInDay: 0,
                self: this,
                cron: cron.schedule('0 0 * * *', () => users[users.length - 1].wordsJustifiedInDay = 0) //every 24 hours
            });
            users[users.length - 1].cron.start();

            //generate user token:
            const userToken = jwt.sign(users[users.length - 1], process.env.JWT_SECRET_KEY);

            res.status(200).send("This is your token. Keep it safely: " + userToken);
        } catch {
            res.status(500).send("Can't create token!");
        }
    }
})

app.listen(3000);