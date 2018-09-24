let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Constant = require('../libs/Constant');
let path = require('path');
let fs = require('fs');
let _ = require('lodash');
let async = require('async');

let random = require('mongoose-simple-random');

let ItemSchema = new Schema({
    alias: {type: String, default: '', required: true, unique: true},
    name: {type: String, default: '', required: true},
    price: {type: Number, default: 0, required: true},
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    rating: {type: Number, default: 0, required: true},
    sale: {type: Number, default: 0, required: true},
    voted_count: {type: Number, default: '', required: true},
    short_desc: {type: String, default: '', required: true},
    desc: {type: String, default: '', required: true},
    tags: {type: String, default: '', required: true},
    in_stock: {type: Boolean, default: true, required: true},
    is_active: {type: Boolean, default: true, required: true},
    ordered_by: {type: Number, default: 0, required: true},
});

ItemSchema.methods.loadImages = function (cb) {
    let way = path.join(Constant.ITEMS_ASSETS_DIR, this.alias);
    if (fs.existsSync(way)) {
        fs.readdir(way, (err, files) => {
            if (err) {
                cb(err);
            } else {
                files.forEach(function(el, index, arr){
                    arr[index] = path.join(way, el).replace('uploads/', '');
                });
                cb(null, files);
            }
        });
    } else {
        cb(null);
    }
};

ItemSchema.methods.order = function(cb){
    this.ordered_by++;
    this.save(cb);
};

ItemSchema.statics.clone = function(item, cb){
    let obj = JSON.parse(JSON.stringify(item));
    obj.alias += '_' + _.now();
    obj.name += ' ' + _.random(0, 100);
    delete obj._id;
    let newItem = new this(obj);
    newItem.save(cb);
};

ItemSchema.statics.list = function(rules, cb ){
    let query;

    let findObj = {};

    if(rules.category_id){
        findObj = {category: rules.category_id};
    }

    if(rules.count){
        query = this.count(findObj);
    }else{
        query = this.find(findObj);
    }
    if(rules.sort){
        query = query.sort(rules.sort);
    }
    if(rules.price_from && rules.price_to){
        console.log(rules.price_from + " " + rules.price_to);
        query = query.where('price').gte(rules.price_from).lte(rules.price_to);
    }
    if(rules.sale){
        query = query.where('sale').gt(0);
    }
    if(rules.active){
        query = query.where('is_active').eq(true);
    }
    if(rules.limit){
        query = query.limit(rules.limit);
    }
    if(rules.skip){
        query = query.skip(rules.skip);
    }
    if(rules.populate){
        query = query.populate('category');
    }
    query.exec(function(err, result){
        if(err){
            cb(err);
        }else{
            cb(null, result);
        }
    });
};

ItemSchema.statics.loadImages = function(items, callback ){
    async.map(items, function (item, cb) {
        item.loadImages(function (err, images) {
            if (err) {
                return cb(err);
            } else {
                if (images) {
                    item.images = images;
                    item.preview = images[_.random(0, images.length - 1)];
                }
                cb(null);
            }
        });
    }, function (err) {
        if (err) {
            return callback(err);
        } else {
            callback(null, items);
        }
    });
};

ItemSchema.statics.newestMain = function(count, cb){
    let rules = {
        sort: {_id: -1},
        limit: count*5,
        populate: true
    };

    this.list(rules, function(err, items){
        if(err) {
            cb(err);
        }else{
            items.sort(compareByOrder);
            cb(null, _.reverse(items).splice(0, count));
        }
    });
};

function compareByOrder(a,b) {
    if (a.ordered_by < b.ordered_by)
        return -1;
    if (a.ordered_by > b.ordered_by)
        return 1;
    return 0;
}

ItemSchema.virtual('stars').get(function() {

    let stars = [];

    for(let i=1; i<=5; i++){
        if(i <= this.rating){
            stars.push({type: 'full'});
        }else if(i <= this.rating + 0.5) {
            stars.push({type: 'half'});
        }else{
            stars.push({type: 'empty'});
        }
    }
    return stars
});

ItemSchema.plugin(random);

mongoose.model('Item', ItemSchema);

