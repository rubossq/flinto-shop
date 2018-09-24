let express = require('express');
let router = express.Router();

let passport = require('../passport/passport');

let catalog = require('./categories');
let items = require('./items');

let countFiles = require('count-files');
let Constant = require('../libs/Constant');
const prettyBytes = require('pretty-bytes');
let rimraf = require('rimraf');
const mongoose = require('mongoose');
let Item = mongoose.model('Item');
let Category = mongoose.model('Category');

router.get('/login', function (req, res, next) {
    res.render('admin_pages/login', {layout: 'layouts/admin_layout', title: 'Login'});
});

router.post('/login', passport.login);

router.get('/register', passport.register);

router.use(passport.isAuth);

router.get('/', function (req, res, next) {

    countFiles(Constant.UPLOADS_DIR, function (err, tmpStat) {

        try{
            tmpStat.exists = true;
            tmpStat.bytesStr = prettyBytes(tmpStat.bytes);
        }catch(e){

        }

        Category.count({}, function(err, c) {
            Item.count({}, function(err, i) {
                let catCount = c || 0;
                let itemsCount = i || 0;
                res.render('admin_pages/index', {
                    layout: 'layouts/admin_layout',
                    title: 'Admin panel',
                    afterBody: '<script src="js/admin_panel.js"></script>' +
                    '<script src="js/admin_index.js"></script>' +
                    '<script>setBaseUrl("' + req.baseUrl + '")</script>',
                    expandMain: true,
                    tmpStat: tmpStat,
                    catCount: catCount,
                    itemsCount: itemsCount
                });
            });
        });


    });


});

router.post('/clear_tmp', function (req, res, next) {
    rimraf(Constant.UPLOADS_DIR, function (err) {
        if (err) {
            return next(err);
        } else {
            res.json({result: 'ok'});
        }
    });
});

router.get('/logout', passport.logout);


router.use('/catalog', catalog);
router.use('/catalog/items', items);


module.exports = router;
