let express = require('express');
let router = express.Router();


router.get('/privacy', function (req, res, next) {
    res.render('pages/qa', {
        layout: 'layouts/main_layout', title: 'Privacy policy', tab: 'privacy'
    });
});

router.get('/refund', function (req, res, next) {
    res.render('pages/qa', {
        layout: 'layouts/main_layout', title: 'Refund policy', tab: 'refund'
    });
});

router.get('/terms', function (req, res, next) {
    res.render('pages/qa', {
        layout: 'layouts/main_layout', title: 'Terms of service', tab: 'terms'
    });
});

router.get('/about', function (req, res, next) {
    res.render('pages/qa', {
        layout: 'layouts/main_layout', title: 'About', tab: 'about'
    });
});

module.exports = router;