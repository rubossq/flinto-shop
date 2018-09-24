let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Category = mongoose.model('Category');
let Item = mongoose.model('Item');

let qa = require('./main_qa');
let catalog = require('./main_categories');
let item = require('./main_items');
let cart = require('./cart');
let helpers = require('../libs/helpers');

router.get('/', function (req, res, next) {
    Item.newestMain(4, function (err, newestItems) {
        Item.list({limit: 4, sort: {ordered_by: -1}, sale: true, populate: true}, function (err, salesItems) {
            Item.list({limit: 4, sort: {ordered_by: -1}, populate: true}, function (err, bestItems) {
                let allItems = [].concat(newestItems, salesItems, bestItems);
                Item.loadImages(allItems, function (err, items) {
                    if (err) {
                        return next(err);
                    } else {
                        res.render('pages/index', {
                            layout: 'layouts/main_layout',
                            title: 'Flintoshop',
                            afterBody: '<script src="js/index.js"></script>',
                            newestItems: newestItems,
                            salesItems: salesItems,
                            bestItems: bestItems
                        });
                    }
                });
            });
        });
    });

});

router.use('/cart', cart);
router.use('/catalog', catalog);
router.use('/catalog/:category', function(req, res, next){
    res.locals.category = req.params.category;
    next();
}, item);
router.use('/catalog/items', item);
router.use('/qa', qa);

router.get('/checkout', function (req, res, next) {
    helpers.loadCart(req, res, function(err, info){
        if (err) {
            helpers.notFound404(next);
        } else {
            res.render('pages/checkout', Object.assign(info,{
                layout: 'layouts/main_layout',
                title: 'Checkout'
            }));
        }
    });
});

router.get('/contacts', function (req, res, next) {
    res.render('pages/contacts', {
        layout: 'layouts/main_layout', title: 'Contacts'
    });
});


module.exports = router;
