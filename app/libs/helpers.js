let Constant = require('./Constant');
let mongoose = require('mongoose');
let Category = mongoose.model('Category');
let Item = mongoose.model('Item');
let _ = require('lodash');

module.exports.notFound404 = function(next){
    let err = new Error();
    err.status = 404;
    next(err);
};

module.exports.loadHelpGoods = function(cb){
    Item.newestMain(3, function (err, newestItems) {
        Item.list({
            limit: 3,
            sort: {ordered_by: -1},
            sale: true,
            populate: true
        }, function (err, salesItems) {
            if(err){
                cb(err);
            }else{
                Item.list({limit: 3, sort: {ordered_by: -1},  populate: true}, function (err, bestItems) {
                    if(err){
                        cb(err);
                    }else {
                        Item.findRandom({}, {}, {limit: 3, populate: 'category'}, function (err, randomItems) {
                            if(err){
                                cb(err);
                            }else {
                                let allItems = [].concat(newestItems, salesItems, bestItems, randomItems);

                                Item.loadImages(allItems, function (err) {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        cb(null, newestItems, salesItems, bestItems, randomItems);
                                    }
                                });
                            }
                        });
                    }
                });
            }

        });
    });
};

module.exports.extractRules = function(query, defaults, cb) {
    let filter = defaults ? 'popularity' : undefined;
    let sort = defaults ? 'low2high' : undefined;
    let price_from = defaults ? 0 : undefined;
    let price_to = defaults ? 1000 : undefined;
    let skip = defaults ? 0 : undefined;
    let category = defaults ? 'all' : undefined;

    if (query.filter && ~Constant.CATALOG_FILTERS.indexOf(query.filter)) {
        filter = query.filter;
    }

    if (query.category) {
        category = query.category;
    }

    if (query.sort && ~Constant.CATALOG_SORTS.indexOf(query.sort)) {
        sort = query.sort;
    }

    if ((query.price_from || +query.price_from === 0) && _.isNumber(+query.price_from)) {
        price_from = +query.price_from;
    }

    if (query.price_to && _.isNumber(+query.price_to)) {
        price_to = +query.price_to;
    }

    if ((query.skip || +query.skip === 0) && _.isNumber(+query.skip)) {
        skip = +query.skip;
    }

    let sortRule = {};

    if (sort) {
        sortRule = {price: 1};
        if (sort === 'high2low') {
            sortRule = {price: -1};
        }
    }

    let rules = {
        skip: skip,
        price_from: price_from,
        price_to: price_to,
        filter: filter,
        sortFilter: sort,
        category: category
    };

    switch (filter) {
        case 'newest':
            rules.sort = Object.assign({_id: -1}, sortRule);
            break;
        case 'popularity':
            rules.sort = Object.assign({ordered_by: -1}, sortRule);
            break;
        case 'sales':
            rules.sort = Object.assign({ordered_by: -1}, sortRule);
            rules.sale = true;
            break;
    }

    if (category && category !== 'all') {
        Category.findOne({alias: category}, function (err, category) {
            if (!err && category) {
                rules.category_id = category._id;
                rules.categoryField = {alias: category.alias, name: category.name};
            }
            cb(rules);
        });
    } else {
        cb(rules);
    }

};

module.exports.loadCart = function(req, res, cb){
    let cart = req.session.cart;
    if (cart) {
        let aliases = [];
        for (let i = 0; i < cart.length; i++) {
            aliases.push(cart[i].alias);
        }

        Item.find({alias: {'$in': aliases}})
            .sort({name: 1})
            .populate('category')
            .exec(function (err, items) {
                if (err || !items) {
                    cb(new Error());
                } else {
                    Item.loadImages(items, function (err, items) {
                        if (!err && items) {
                            let size = module.exports.getCartSize(req);
                            let taxes = size * 1;
                            let shipping = size * 2;

                            items.forEach(function (item) {
                                let index = _.findIndex(cart, function (o) {
                                    return o.alias === item.alias;
                                });

                                item.count = cart[index].count;
                                item.total = item.price * item.count;
                            });

                            let totalPrice = items.reduce(function (accumulator, currentValue, index, array) {
                                return accumulator + currentValue.total;
                            }, 0);
                            let summary = shipping + taxes + totalPrice;

                            cb(null, {
                                taxes: taxes,
                                shipping: shipping,
                                totalPrice: totalPrice,
                                summary: summary,
                                size: size,
                                items: items
                            });

                        }else{
                            cb(new Error());
                        }
                    });
                }
            });
    }
};

module.exports.getCartSize = function (req) {
    let size = 0;

    if (req.session.cart) {
        for (let i = 0; i < req.session.cart.length; i++) {
            size += req.session.cart[i].count;
        }
    }
    return size;
}