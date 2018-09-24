const APP_MODELS = "app/models";
const UPLOADS_DIR = 'uploads/tmp';

const ITEMS_ASSETS_DIR = 'uploads/images/items';

const CATALOG_FILTERS = ['popularity', 'newest', 'sales'];
const CATALOG_SORTS = ['low2high', 'high2low'];
const SKIP_STEP = 6;
const IMAGES_LIMIT = 6;
const PAGINATION_SIDES = 3;

class Constant {
    static get APP_MODELS() {
        return APP_MODELS;
    }

    static get UPLOADS_DIR() {
        return UPLOADS_DIR;
    }

    static get ITEMS_ASSETS_DIR() {
        return ITEMS_ASSETS_DIR;
    }

    static get CATALOG_FILTERS() {
        return CATALOG_FILTERS;
    }

    static get CATALOG_SORTS() {
        return CATALOG_SORTS;
    }

    static get SKIP_STEP() {
        return SKIP_STEP;
    }

    static get IMAGES_LIMIT() {
        return IMAGES_LIMIT;
    }

    static get PAGINATION_SIDES() {
        return PAGINATION_SIDES;
    }

    static NOT_FOUND() {
        return PAGINATION_SIDES;
    }
}

module.exports = Constant;