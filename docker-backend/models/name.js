const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nameSchema = new Schema({
    firstName: String,
    lastName: String,
    fullName: String
});

const NameModel = mongoose.model('Name', nameSchema);

module.exports = NameModel;