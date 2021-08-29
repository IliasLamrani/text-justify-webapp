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
app.use(express.static('app/'));
app.use(express.static('app/login'));
app.use(express.static('app/justify-text'));

const port = process.env.PORT || 3000;
const maxLineLength = 80;
const maxFreeWords = 80000;
const fileName = "./tmp"
const encoding = "utf8"

const users = [];

app.get('/', (req, res) => {
    res.sendFile('app/login/login.html', {root: '.'});
})

app.get('/justify', (req, res) => {
    res.sendFile('/app/justify-text/justify-text.html', {root: '.'});
})

app.post('/api/verify-token', authenticationMiddleware, (req, res) => {
    res.status(200).json({message: 'Token is correct', code: 200}); //job was done in middleware
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
                res.status(403).json({message: 'Invalid token', code: 403});
                return;
            }
            req.user = user;
            next();
        })
    } else {
        res.status(401).json({message: 'Please provide your token', code: 401});
    }
}

app.post('/api/justify', authenticationMiddleware, (req, res) => {
    if (users[req.user.id].wordsJustifiedInDay + req.body.length > maxFreeWords) {
        res.status(402).json({message: 'Payment required! You used your free 80 000 words', code: 402});
    } else {
        try {
            justifyText(fileName, req.body, maxLineLength);
            const data = fs.readFileSync(fileName, encoding);
            res.status(200).json({message: data, code: 200});

            fs.unlink(fileName, err => { //we don't need the output file anymore
                if (err)
                    console.log(err);
            });

            users[req.user.id].wordsJustifiedInDay += req.body.length;
        } catch(e) {
            res.status(500).json({message: "Can't justify given text.", code: 500});
        }
    }
})

app.post('/api/token', async (req, res) => {
    if (!req.body.email) {
        res.status(400).json({message: "Please provide an email", code: 400});
    }
    else if (!req.body.password) {
        res.status(400).json({message: "Please provide a password", code: 400});
    } else {
        try {
            if (users.find(user => user.email === req.body.email)) {
                return res.status(303).json({message: 'You already have an account!', code: 303});
            }
            //hash user password and save his infos:
            let salt = await bcrypt.genSalt();
            let pwd = await bcrypt.hash(req.body.password, salt);

            const userID = users.length;
            users.push({
                id: userID,
                email: req.body.email,
                password: pwd,
                wordsJustifiedInDay: 0,
                cron: cron.schedule('0 0 * * *', () => users[userID].wordsJustifiedInDay = 0) //every 24 hours
            });
            users[userID].cron.start();

            //generate user token:
            const userToken = jwt.sign(users[users.length - 1], process.env.JWT_SECRET_KEY);

            res.status(200).json(userToken);
        } catch(e) {
            res.status(500).json({message: "Can't create token!", code: 500});
        }
    }
})

app.listen(port);