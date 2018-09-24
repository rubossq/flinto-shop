let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Category = mongoose.model('Category');
let Item = mongoose.model('Item');
let _ = require('lodash');
let Constant = require('../libs/Constant');
let helpers = require('../libs/helpers');



router.get('/:item', function (req, res, next) {
    Category.findOne({alias: res.locals.category}, function (err, category) {
        if (err || !category) {
            helpers.notFound404(next);
        } else {
            Item.findOne({alias: req.params.item, is_active: true}).populate('category').exec(function (err, item) {
                if (err || !item) {
                    helpers.notFound404(next);
                } else {
                    if(category.alias !== item.category.alias){
                        helpers.notFound404(next);
                    }else{
                        Item.loadImages([item], function(err, items){
                            if (err || !items[0]) {
                                helpers.notFound404(next);
                            }else{
                                helpers.loadHelpGoods(function(err, newestItems, salesItems, bestItems, randomItems) {
                                    if (err) {
                                        next(err);
                                    } else {
                                        Item.findRandom({category: category._id}, {}, {limit: 4, populate: 'category'}, function (err, relatedItems) {
                                            if(err){
                                                cb(err);
                                            }else {
                                                Item.loadImages(relatedItems, function (err) {
                                                    if (err) {
                                                        next(err);
                                                    } else {
                                                        res.render('pages/details', {
                                                            layout: 'layouts/main_layout',
                                                            title: 'Item',
                                                            item: items[0],
                                                            category: category,
                                                            newestItems: newestItems,
                                                            salesItems: salesItems,
                                                            bestItems: bestItems,
                                                            randomItems: randomItems,
                                                            relatedItems: relatedItems
                                                        });
                                                    }
                                                });
                                            }
                                        });


                                    }
                                });

                            }
                        });
                    }
                }
            });
        }

    });

});

router.post('/find', function(req, res, next){
    let q = req.body.name;
    if(q.length >= 3){
        Item.find({name: new RegExp(q, "i")}).limit(10).populate('category').exec(function(err, items) {
            if(err || !items){
                res.json({status: "err", message: "Items not found"});
            }else{
                Item.loadImages(items, function(err, items) {
                    if (err || !items[0]) {
                        res.json({status: "err", message: "Items not found"});
                    } else {
                        let result = items.map(function(item){
                            return _.pick(item, ['name', 'alias', 'preview', 'category.alias']);
                        });
                        res.json({status: "ok", items: result});
                    }
                });

            }
        });
    }else{
        res.json({status: "err", message: "Items not found"});
    }

});

module.exports = router;