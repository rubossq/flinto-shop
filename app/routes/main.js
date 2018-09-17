let express = require('express');
let router = express.Router();


router.get('/', function(req, res, next) {
  res.render('pages/index', { layout:'layouts/main_layout', title: 'Flintoshop', afterBody: '<script src="js/index.js"></script>' });
});

router.get('/cart', function(req, res, next) {
    res.render('pages/cart', { layout:'layouts/main_layout', title: 'Your Cart' });
});

router.get('/catalog', function(req, res, next) {
    res.render('pages/categories', { layout:'layouts/main_layout', title: 'Catalog' });
});

router.get('/catalog/:category', function(req, res, next) {
    res.render('pages/categories', { layout:'layouts/main_layout', title: 'Category' });
});

router.get('/catalog/:category/:item', function(req, res, next) {
    res.render('pages/details', { layout:'layouts/main_layout', title: 'Item' });
});

router.get('/checkout', function(req, res, next) {
    res.render('pages/checkout', { layout:'layouts/main_layout', title: 'Checkout' });
});

router.get('/qa', function(req, res, next) {
    res.render('pages/qa', { layout:'layouts/main_layout', title: 'QA' });
});

router.get('/contacts', function(req, res, next) {
    res.render('pages/contacts', { layout:'layouts/main_layout', title: 'Contacts' });
});


module.exports = router;
