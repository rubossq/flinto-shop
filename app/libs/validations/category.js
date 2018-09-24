let Joi = require('joi');

module.exports = {
    body: {
        alias: Joi.string().alphanum().min(3).max(30).required(),
        name: Joi.string().alphanum().min(3).max(30).required()
    }
};