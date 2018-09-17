let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('admin_pages/index', { layout:'layouts/admin_layout', title: 'Admin panel', afterBody: '<script src="js/admin_panel.js"></script>'});
});

router.get('/catalog/edit/:category/', function(req, res, next) {
    res.render('admin_pages/edit_category', { layout:'layouts/admin_layout', title: 'Edit category', afterBody: '<script src="js/admin_panel.js"></script>'});
});

router.get('/catalog/:category/:item', function(req, res, next) {
    res.render('admin_pages/edit_item', { layout:'layouts/admin_layout', title: 'Edit item', afterBody: '<script src="js/admin_panel.js"></script>'});
});

router.get('/catalog', function(req, res, next) {
    res.render('admin_pages/categories', { layout:'layouts/admin_layout', title: 'Categories', afterBody: '<script src="js/admin_panel.js"></script>'});
});

router.get('/catalog/:category', function(req, res, next) {
    res.render('admin_pages/items', { layout:'layouts/admin_layout', title: 'Items', afterBody: '<script src="js/admin_panel.js"></script>'});
});

router.get('/login', function(req, res, next) {
    res.render('admin_pages/login', { layout:'layouts/admin_layout', title: 'Login'});
});


module.exports = router;
