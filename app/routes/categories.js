let express = require('express');
let router = express.Router();
let validate = require('express-validation');
let validation = require('../libs/validations/category');
const mongoose = require('mongoose');
let Category = mongoose.model('Category');
let Item = mongoose.model('Item');

router.get('/', function (req, res, next) {
    Category.find({}).sort({_id: -1}).exec(function (err, categories) {
        if (err) {
            return next(err);
        } else {
            res.render('admin_pages/categories', {
                layout: 'layouts/admin_layout',
                title: 'Categories',
                categories: categories,
                baseUrl: req.baseUrl,
                expandCategories: true,
                afterBody: '<script src="js/admin_panel.js"></script>'
            });
        }
    });
});

router.get('/edit/:category_id?', function (req, res, next) {
    let locals = {
        layout: 'layouts/admin_layout',
        title: 'Edit category',
        expandCategories: true,
        afterBody: '<script src="js/admin_panel.js"></script>',
        baseUrl: req.baseUrl
    };
    let page = 'admin_pages/edit_category';
    if (req.params.category_id) {
        Category.findById(req.params.category_id, function (err, category) {
            if (err) {
                return next(err);
            } else {
                locals.category = category;
                res.render(page, locals);
            }
        });
    } else {
        res.render(page, locals);
    }
});

router.post('/edit/:category_id?', validate(validation), function (req, res, next) {

    let obj = {alias: req.sanitize(req.body.alias), name: req.sanitize(req.body.name)};
    if (!req.params.category_id) {
        Category.create(obj, function (err, category) {
            if (err) {
                return next(err);
            } else {
                res.redirect(req.baseUrl);
            }
        });
    } else {
        Category.findByIdAndUpdate(req.params.category_id, obj, function (err, category) {
            if (err) {
                return next(err);
            } else {
                res.redirect(req.baseUrl);
            }
        })
    }

});

router.get('/remove/:alias', function (req, res, next) {

    Category.findOne({alias: req.params.alias}, function (err, category) {
        Item.deleteMany({category: category._id}, function(err){
            if (err) {
                return next(err);
            } else {
                Category.deleteOne({alias: req.params.alias}, function (err) {
                    if (err) {
                        return next(err);
                    } else {
                        res.redirect(req.baseUrl);
                    }
                });
            }
        });
    });


});

router.get('/copy/:alias', function (req, res, next) {

    Category.findOne({alias: req.params.alias}, function (err, category) {
        if (err) {
            return next(err);
        } else {
            Category.clone(category, function(err, newCategory){
                if (err) {
                    return next(err);
                } else {
                    res.redirect(req.baseUrl + '/edit/' + newCategory._id);
                }
            });
        }
    });

});

module.exports = router;