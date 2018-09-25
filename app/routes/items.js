let express = require('express');
let router = express.Router();

let validate = require('express-validation');
let validation = require('../libs/validations/item');
const mongoose = require('mongoose');
let Item = mongoose.model('Item');
let Category = mongoose.model('Category');
let Constant = require('../libs/Constant');
let mkdirp = require('mkdirp');
let rimraf = require('rimraf');
let _ = require('lodash');
let multer = require('multer');

let fsExtra = require('fs-extra');

let fs = require('fs');
let path = require('path');

router.get('/', function (req, res, next) {
    Item.find({}).sort({_id: -1}).populate('category').exec(function (err, items) {
        if (err) {
            return next(err);
        } else {
            Item.loadImages(items, function(err, items){
                if (err) {
                    return next(err);
                } else {
                    res.render('admin_pages/items', {
                        layout: 'layouts/admin_layout',
                        title: 'Items',
                        items: items,
                        baseUrl: req.baseUrl,
                        expandItems: true,
                        afterBody: '<script src="js/admin_panel.js"></script>'
                    });
                }
            });
        }
    });
});

router.get('/edit/:item_id?', function (req, res, next) {

    req.session.item_temp_id = "item_" + _.now();

    Category.find({}).sort({_id: -1}).exec(function (err, categories) {
        if (err) {
            return next(err);
        } else {

            let ratings = _.range(1, 5.5, 0.5);

            let locals = {
                layout: 'layouts/admin_layout',
                title: 'Edit item',
                categories: categories,
                ratings: ratings,
                expandItems: true,
                baseUrl: req.baseUrl,
                afterBody: '<script src="js/admin_panel.js"></script>' +
                '<script src="js/admin_edit_item.js"></script>' +
                '<script>setBaseUrl("' + req.baseUrl + '")</script>'
            };
            let page = 'admin_pages/edit_item';
            if (req.params.item_id) {
                Item.findById(req.params.item_id).populate('category').exec(function (err, item) {
                    if (err) {
                        return next(err);
                    } else {
                        item.loadImages(function(err, images){
                            if (err) {
                                return next(err);
                            } else {
                                item.images = images;
                                console.log(images);
                                locals.item = item;
                                res.render(page, locals);
                            }

                        });

                    }
                });
            } else {
                res.render(page, locals);
            }
        }
    });


});

router.post('/upload', function (req, res, next) {

    let dest = path.join(Constant.UPLOADS_DIR, req.session.item_temp_id);
    mkdirp(dest, function (err) {
        if (err) {
            next(err);
        } else {

            let storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, dest)
                },
                filename: function (req, file, cb) {
                    cb(null, file.fieldname + '-' + _.now() + '.jpg');
                }
            });

            let upload = multer({storage: storage}).single('photo');

            upload(req, res, function (err) {
                if (err) {
                    return next(err);
                } else {
                    let src = path.join(dest, req.file.filename).replace('uploads/', '');
                    res.json({result: 'ok', src: src});
                }
            });
        }
    });

});

router.get('/:category', function (req, res, next) {

    Category.findOne({alias: req.params.category}).exec(function (err, category) {
        if (err) {
            return next(err);
        } else {
            Item.find({category: category._id}).populate('category').exec(function (err, items) {
                if (err) {
                    return next(err);
                } else {
                    Item.loadImages(items, function(err, items){
                        if (err) {
                            return next(err);
                        } else {
                            res.render('admin_pages/items', {
                                layout: 'layouts/admin_layout',
                                title: 'Items from ' + category.name,
                                expandItems: true,
                                afterBody: '<script src="js/admin_panel.js"></script>',
                                items: items,
                                baseUrl: req.baseUrl
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/:id/images/remove', function (req, res, next) {


    let src = path.join(req.params.id, req.body.name);

    if(req.body.folder && req.body.folder === 'tmp'){
        src = path.join(Constant.UPLOADS_DIR, req.session.item_temp_id, req.body.name);
    }else{
        src = path.join(Constant.ITEMS_ASSETS_DIR, src);
    }

    console.log(src);

    rimraf(src, function (err) {
        if (err) {
            return next(err);
        } else {
            res.json({result: 'ok'});
        }
    });
});

router.post('/edit/:item_id?', validate(validation), function (req, res, next) {

    let obj = {
        alias: req.sanitize(req.body.alias),
        name: req.sanitize(req.body.name),
        price: req.body.price,
        sale: req.body.sale,
        rating: req.body.rating,
        voted_count: req.body.voted_count,
        short_desc: req.sanitize(req.body.short_desc),
        desc: req.sanitize(req.body.desc),
        tags: req.sanitize(req.body.tags),
        is_active: req.body.is_active === "on",
        in_stock: req.body.in_stock === "on",
        category: req.body.category_id
    };

    if (!req.params.item_id) {
        Item.create(obj, function (err, item) {
            if (err) {
                return next(err);
            } else {
                mvAndRedirect(req, res, next, item);
            }
        });
    } else {
        Item.findByIdAndUpdate(req.params.item_id, obj, function (err, item) {
            if (err) {
                return next(err);
            } else {
                mvAndRedirect(req, res, next, item);
            }
        })
    }

});

function mvAndRedirect(req, res, next, item){
    let src = path.join(Constant.UPLOADS_DIR, req.session.item_temp_id);
    let dest = path.join(Constant.ITEMS_ASSETS_DIR, item._id + '');
    if (fs.existsSync(src)) {
        fsExtra.copy(src, dest, {overwrite: false}, err => {
            if (err) {
                next(err);
            } else {
                rimraf(src, function (err) {
                    if (err) {
                        return next(err);
                    } else {
                        res.redirect(req.baseUrl);
                        req.session.item_temp_id = null;
                    }
                });
            }
        });
    }else{
        res.redirect(req.baseUrl);
    }

}

router.get('/remove/:id', function (req, res, next) {

    Item.deleteOne({_id: req.params.id}, function (err) {
        if (err) {
            return next(err);
        } else {
            let src = path.join(Constant.ITEMS_ASSETS_DIR, req.params.id);
            rimraf(src, function (err) {
                if (err) {
                    return next(err);
                } else {
                    res.redirect(req.baseUrl);
                }
            });
        }
    });

});

router.get('/copy/:alias', function (req, res, next) {

    Item.findOne({alias: req.params.alias}, function (err, item) {
        if (err) {
            return next(err);
        } else {
            Item.clone(item, function(err, newItem){
                if (err) {
                    return next(err);
                } else {
                    res.redirect(req.baseUrl + '/edit/' + newItem._id);
                }
            });
        }
    });

});

module.exports = router;