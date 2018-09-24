let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let _ = require('lodash');

let CategorySchema = new Schema({
    alias: {type: String, default: '', required: true, unique: true},
    name: {type: String, default: '', required: true}
});

CategorySchema.statics.clone = function(category, cb){
    let obj = JSON.parse(JSON.stringify(category));
    obj.alias += '_' + _.now();
    obj.name += ' ' + _.random(0, 100);
    delete obj._id;
    let newCategory = new this(obj);
    newCategory.save(cb);
};

mongoose.model('Category', CategorySchema);
