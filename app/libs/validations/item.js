let Joi = require('joi');

module.exports = {
    body: {
        alias: Joi.string().regex(/[a-z\d\-_]{3,30}/i).required(),
        name: Joi.string().regex(/[a-z\d\-_\s]{3,30}/i).required(),
        price: Joi.number().min(0).required(),
        sale: Joi.number().required(),
        rating: Joi.number().min(1).max(5).required(),
        voted_count: Joi.number().min(1).required(),
        short_desc: Joi.string().required(),
        desc: Joi.string().required(),
        tags: Joi.string().max(150).required(),
        category_id: Joi.string().alphanum().required()
    }
};