const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/photo_app', {useNewUrlParser: true});

const schema = new Schema({
    name: String,
    path: String,
});

module.exports = mongoose.model('Photo', schema);