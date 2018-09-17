const mongoose = require('mongoose');
const LocalStrategy  = require('passport-local').Strategy;

const User = mongoose.model('User');

module.exports.init = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            err
                ? done(err)
                : done(null, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            return err
                ? done(err)
                : user
                    ? password === user.password
                        ? done(null, user)
                        : done(null, false, {message: 'Incorrect password.'})
                    : done(null, false, {message: 'Incorrect username.'});
        });
    }));
};

module.exports.login = function (req, res, next) {
    passport.authenticate('local',
        function (err, user, info) {
            return err
                ? next(err)
                : user
                    ? req.logIn(user, function (err) {
                        return err
                            ? next(err)
                            : res.redirect('/admin');
                    })
                    : res.redirect('/admin/login');
        }
    )(req, res, next);
};


module.exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

module.exports.register = function (req, res, next) {
    let user = new User({username: req.body.username, password: req.body.password});
    user.save(function (err) {
        return err
            ? next(err)
            : req.logIn(user, function (err) {
                return err
                    ? next(err)
                    : res.redirect('/admin');
            });
    });
};