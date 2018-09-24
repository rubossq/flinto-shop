let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Item = mongoose.model('Item');
let _ = require('lodash');
let helpers = require('../libs/helpers');

router.get('/', function (req, res, next) {

    helpers.loadCart(req, res, function(err, info){
        if (err) {
            res.render('pages/cart', {layout: 'layouts/main_layout', title: 'Your Cart'});
        } else {
            res.render('pages/cart', Object.assign(info,{
                layout: 'layouts/main_layout',
                title: 'Your Cart'
            }));
        }
    });
});

router.post('/size', function (req, res, next) {

    res.json({status: 'ok', size: helpers.getCartSize(req)});
});



router.post('/add', function (req, res, next) {
    Item.findOne({alias: req.body.alias}).populate('category').exec(function (err, item) {
        if (err || !item) {
            res.json({status: 'err', message: 'Item not found'});
        } else {
            req.session.cart = req.session.cart || [];

            let cart = req.session.cart;

            let index = _.findIndex(cart, function (o) {
                return o.alias === req.body.alias;
            });

            if (index !== -1) {
                cart[index].count += req.body.count;
                item.count = cart[index].count;
            } else {
                cart.push(
                    Object.assign({count: 1},
                        _.pick(item, ['alias', '_id', 'category._id', 'category.alias']))
                );
                item.count = 1;
            }



            res.json({
                status: 'ok',
                item: _.pick(
                    item,
                    ['alias', '_id', 'name', 'category._id',
                        'category.alias', 'count', 'price']),
                size: helpers.getCartSize(req)
            });
        }
    });
});

router.post('/remove', function (req, res, next) {
    Item.findOne({alias: req.body.alias}).populate('category').exec(function (err, item) {
        if (err || !item) {
            res.json({status: 'err', message: 'Item not found'});
        } else {
            req.session.cart = req.session.cart || [];

            let cart = req.session.cart;

            let index = _.findIndex(cart, function (o) {
                return o.alias === req.body.alias;
            });

            let countLeft = 0;
            if (index !== -1) {
                cart[index].count -= req.body.all ? cart[index].count : req.body.count;
                if (cart[index].count <= 0) {
                    cart.splice(index, 1);
                } else {
                    countLeft = cart[index].count;
                }
            }

            item.count = countLeft;

            res.json({
                status: 'ok',
                item: _.pick(
                    item,
                    ['alias', '_id', 'name', 'category._id',
                        'category.alias', 'count', 'price']),
                size: helpers.getCartSize(req)
            });
        }
    });
});

router.get('/clear', function (req, res, next) {
    req.session.cart = [];
    res.redirect(req.baseUrl);
});

module.exports = router;