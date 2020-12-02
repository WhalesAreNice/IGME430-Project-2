const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let ShopperModel = {};

// mongose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const ShopperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },

    age: {
        type: Number,
        min: 0,
        required: true,
    },
    
    money: {
        type: Number,
        min: 0,
        required: true,
    },

    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },

    createdData: {
        type: Date,
        default: Date.now,
    },
    
    cart: []
});

ShopperSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
    money: doc.money,
});

ShopperSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId),
    };
    return ShopperModel.find(search).select('name age money').lean().exec(callback);
};

ShopperModel = mongoose.model('Shopper', ShopperSchema);

module.exports.ShopperModel = ShopperModel;
module.exports.ShopperSchema = ShopperSchema;