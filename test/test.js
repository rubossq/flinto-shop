let expect = require('chai').expect;
let should = require('chai').should();

let sinon = require('sinon');
let mongoose = require('mongoose');
let fs = require('fs');
let path = require('path');

const env = process.env.NODE_ENV || 'development';
const Config = require('../app/config.json')[env];
const Constant = require('../app/libs/Constant');

// Bootstrap models
fs.readdirSync(path.join(__dirname, '../', Constant.APP_MODELS))
    .filter(function (file) {
        return file.indexOf('.js');
    })
    .forEach(function (file) {
        require(path.join(path.join(__dirname, '../', Constant.APP_MODELS), file));
    });

mongoose.connect(Config.MONGO_URL + Config.TEST_DB);

let Item = mongoose.model('Item');
let Category = mongoose.model('Category');

describe('Item model', function () {

    let category;

    before(function (done) {
        Item.remove({}, function (err) {
            if (err) {
                throw(err);
            } else {
                Category.remove({}, function (err) {
                    if (err) {
                        throw(err);
                    } else {
                        Category.create({alias: 'category_alias', name: 'Category name'}, function (err, c) {
                            if (err) {
                                throw(err);
                            } else {
                                category = c;
                                done();
                            }
                        });
                    }
                });
            }
        });


    });

    describe('Create item', function () {
        it('should create and add new item to db', function (done) {
            let obj = {
                alias: 'item_alias',
                name: 'Item name',
                price: 100,
                sale: 0,
                rating: 4,
                voted_count: 10,
                short_desc: "short desc",
                desc: "our very long and big description",
                tags: "item, super, awesome",
                is_active: true,
                in_stock: true,
                category: category._id
            };

            Item.create(obj, function (err,) {
                if (err) {
                    throw(err);
                } else {
                    Item.findOne({alias: obj.alias}, function (err, item) {
                        if (err) {
                            throw(err);
                        } else {
                            Item.count({}, function (err, count) {
                                if (err) {
                                    throw(err);
                                } else {
                                    expect(item.name).to.equal(obj.name, "Correct item");
                                    expect(count).to.equal(1, "Count of items");
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        });
    });

    describe('Clone item', function () {
        it('should clone existing item', function (done) {
            Item.find({}, function (err, items) {
                if (err) {
                    throw(err);
                } else {
                    let spyCloneMethod = sinon.spy(Item, "clone");
                    expect(items.length).to.be.above(0, "Items exists");
                    Item.clone(items[0], function (err, clone) {
                        if (err) {
                            throw(err);
                        } else {
                            clone.alias.should.be.not.equal(items[0].alias, "Different aliases");
                            clone.name.should.be.not.equal(items[0].name, "Different names");
                            clone.category.toString().should.be.equal(items[0].category.toString(), "Same categoyr");
                            Item.count({}, function (err, count) {
                                if (err) {
                                    throw(err);
                                } else {
                                    count.should.to.be.equal(2, "Count of items");
                                    expect(spyCloneMethod.callCount).to.be.equal(1, "Clone method called once");
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        });
    });

    describe('Make an order', function () {
        it('should save order count', function (done) {
            Item.find({}, function (err, items) {
                if (err) {
                    throw(err);
                } else {
                    for (let i = 0; i < items.length; i++) {
                        items[i].order(function (err, item) {
                            item.ordered_by.should.be.equal(1);
                        });
                    }
                    done();
                }
            });
        });
    });

    describe('Count stars', function () {
        it('should return stars count', function (done) {
            Item.findOne({alias: 'item_alias'}, function (err, item) {
                if (err) {
                    throw(err);
                } else {

                    let stars = item.stars;
                    expect(stars.length).to.be.equal(5, "Total stars count");

                    for (let i = 0; i < stars.length - 1; i++) {
                        stars[i].type.should.be.equal("full", "Full star")
                    }

                    stars[4].type.should.be.equal("empty", "Empty star")

                    done();
                }
            });
        });
    });
});
