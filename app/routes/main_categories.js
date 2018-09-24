let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Category = mongoose.model('Category');
let Item = mongoose.model('Item');
let _ = require('lodash');
let Constant = require('../libs/Constant');
let helpers = require('../libs/helpers');


router.get('/filter', function (req, res, next) {

    let rules = req.session.rules;
    helpers.extractRules(req.query, false, function (setRules) {

        let newRules = _.defaults(setRules, rules);

        let arr = [];

        if (newRules.filter) {
            arr.push("filter=" + newRules.filter);
        }

        if (newRules.price_from || newRules.price_from === 0) {
            arr.push("price_from=" + newRules.price_from);
        }

        if (newRules.price_to) {
            arr.push("price_to=" + newRules.price_to);
        }

        if (newRules.skip || newRules.skip === 0) {
            arr.push("skip=" + newRules.skip);
        }

        if (newRules.sort) {
            arr.push("sort=" + newRules.sortFilter);
        }

        if (newRules.category) {
            arr.push("category=" + newRules.category);
        }

        res.redirect(req.baseUrl + "?" + arr.join('&'));
    });

});

router.get('/', function (req, res, next) {

    helpers.extractRules(req.query, true, function (rules) {

        let countRules = _.assign({}, rules);
        countRules.skip = 0;
        countRules.limit = 0;
        countRules.active = true;

        Item.list(Object.assign({count: true}, countRules), function (err, count) {
            if (err) {
                next(err);
            } else {
                req.session.rules = rules;
                rules.limit = Constant.IMAGES_LIMIT;
                rules.active = true;
                rules.populate = true;

                rules.nextSkip = rules.skip + Constant.SKIP_STEP;
                rules.prewSkip = rules.skip >= Constant.SKIP_STEP ? rules.skip - Constant.SKIP_STEP : 0;

                let curPage = Math.floor(rules.skip / Constant.IMAGES_LIMIT) + 1;
                let maxPage = Math.ceil(count / Constant.IMAGES_LIMIT);
                let minPage = 2;


                let start = (curPage - Constant.PAGINATION_SIDES) >= minPage ? (curPage - Constant.PAGINATION_SIDES) : minPage;
                let end = (curPage + Constant.PAGINATION_SIDES) <= maxPage ? (curPage + Constant.PAGINATION_SIDES) : maxPage;
                let paginations = [];

                for (let i = start; i <= end; i++) {
                    paginations.push({page: i, skip: (i - 1) * Constant.SKIP_STEP});
                }

                let lastPagination = end === maxPage ? paginations.pop() : {
                    page: maxPage,
                    skip: maxPage * Constant.SKIP_STEP
                };
                let showMoreLast, showLessFirst;
                if (paginations.length > 0) {
                    showMoreLast = _.last(paginations).page !== maxPage - 1;
                    showLessFirst = paginations[0].page !== minPage;
                }

                Item.list(rules, function (err, items) {
                    if (err) {
                        next(err);
                    } else {

                        Item.loadImages(items, function (err, items) {
                            if (err) {
                                return next(err);
                            } else {
                                helpers.loadHelpGoods(function(err, newestItems, salesItems, bestItems, randomItems){
                                    if (err) {
                                        next(err);
                                    } else {
                                        Category.find({}).sort({name: 1}).exec(function (err, categories) {
                                            if (err) {
                                                next(err);
                                            } else {
                                                res.render('pages/categories', {
                                                    layout: 'layouts/main_layout',
                                                    title: 'Catalog',
                                                    items: items,
                                                    count: count,
                                                    rules: rules,
                                                    baseUrl: req.baseUrl,
                                                    paginations: paginations,
                                                    lastPagination: lastPagination,
                                                    showMoreLast: showMoreLast,
                                                    showLessFirst: showLessFirst,
                                                    curPage: curPage,
                                                    newestItems: newestItems,
                                                    salesItems: salesItems,
                                                    bestItems: bestItems,
                                                    randomItems: randomItems,
                                                    categories: categories,
                                                    afterBody: '<script src="js/catalog.js"></script>',
                                                    category: rules.categoryField
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
        });

    });
});

module.exports = router;