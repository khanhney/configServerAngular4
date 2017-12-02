const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser').json();

const User = require('./models/User');

const app = express();
// const route = express.Router();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

// Begin route
app.get('/danh-sach', (req, res)=>{
    User.find({})
        .then(result => res.json(result))
        .catch(err => console.log('Error at get /danh-sach'+ err.message));
});

app.post('/them-user', bodyParser, (req, res)=>{
    const {fullName, age, address, email} = req.body;
    // console.log({fullName, age, address, email});
    const demo = new User({fullName, age, address, email});
    demo.save()
        .then(result => res.json(result))
        .catch(err => console.log('Error at post /them-user '+err.message));
});

app.get('/xoa-user/:id', (req, res)=>{
    const { id } = req.params;
    User.findByIdAndRemove(id)
        .then(result => res.json(result))
        .catch(err => console.log('Error at get /xoa-user '+err.message));
});

app.put('/sua-user/:id', bodyParser, (req, res)=>{
    const { id } = req.params;
    const { fullName, age, address, email } = req.body;
    User.findByIdAndUpdate(id, {fullName, age, address, email})
        .then(result => res.json(result))
        .catch(err => console.log('Error at put /sua-user '+err.message));
    // console.log({ fullName, age, address, email });
})

// route edit 2 part
app.get('/sua-user/:id', (req, res)=>{
    const { id } = req.params;
    User.findById(id)
        .then(result => res.json(result))
        .catch(err => console.log(err.message));
})
// End route

// app.use('/api', route);

const uri = 'mongodb://localhost/demoapi';
mongoose.connect(uri, {useMongoClient: true});
mongoose.connection.once('open', ()=>{
    app.listen(3000, ()=> console.log('Server start at port 3000'));
});