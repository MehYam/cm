const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = mongoose.model('User', new Schema({
   created: {type: Date, default: Date.now, required: true},
   firstName: {type: String, required: true},
   lastName: {type: String, required: false}
}));

module.exports =  User;