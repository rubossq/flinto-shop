let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {type: String, default: ''},
    password: {type: String, default: ''}
});

mongoose.model('User', UserSchema);
