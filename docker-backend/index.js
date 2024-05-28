const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Name = require('./models/name');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', async (req, res) => {
    res.status(200).json({message: 'Hello World!'});
})

app.get('/names', async (req, res) => {
    try {
        const names = await Name.find();
        res.status(200).json({
            names: names.map((name) => ({
                id: name.id,
                firstName: name.firstName,
                lastName: name.lastName,
                fullName: name.fullName
            }))
        });
    } catch (err) {
        console.error('Error fetching names');
        console.error(err.message);
        res.status(500).json({message: 'Failed to load names'});
    }
});

app.post('/name', async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const fullName = `${firstName} ${lastName}`;

    if (!firstName || !lastName) {
        return res.status(422).json({message: 'Invalid name'});
    }

    const name = new Name({
        firstName: firstName,
        lastName: lastName,
        fullName: fullName
    });

    try {
        await name.save();
        res.status(201).json({message: 'Name stored'});
    } catch (err) {
        console.error('Error storing name');
        console.error(err.message);
        res.status(500).json({message: 'Failed to store name'});
    }
});

mongoose.connect(`${process.env.MONGO_URI}/names?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB');
    console.error(err.message);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});