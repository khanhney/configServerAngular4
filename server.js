const express = require('express');
const uid = require('uid');
const { createToken, verifyToken } = require('./jwt');
const jsonParser = require('body-parser').json();

const app = express();

const users = [
    { username: 'teo', name: 'Teo Nguyen', password: '123' },
    { username: 'ti', name: 'Ti Nguyen', password: '123' },
    { username: 'tun', name: 'Tun Nguyen', password: '123' },
];

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

app.post('/signin', jsonParser, (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(404).send({ success: false, message: 'Invalid username or password' });
    // delete user.password;
    createToken({ username, password })
    .then(token => res.send({
        success: true,
        token,
        user: {username: user.username, name: user.name}
    }))
});

app.post('/verify', jsonParser, (req, res) => {
    const { token } = req.body;
    verifyToken(token)
    .then(() => res.send({ success: true }))
    .catch(() => res.status(404).send({ success: false }))
});

app.listen(3000, () => console.log('Server started!'));
