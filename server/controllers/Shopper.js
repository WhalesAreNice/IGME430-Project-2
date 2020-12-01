const models = require('../models');

const Shopper = models.Shopper;

const makerPage = (req, res) => {
    Shopper.ShopperModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        return res.render('app', { csrfToken: req.csrfToken(), shoppers: docs });
    });
};

const makeShopper = (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.money) {
        return res.status(400).json({ error: 'RAWR! Name, age, and money are required' });
    }

    const shopperData = {
        name: req.body.name,
        age: req.body.age,
        money: req.body.money,
        owner: req.session.account._id,
    };

    const newShopper = new Shopper.ShopperModel(shopperData);
    
    const shopperPromise = newShopper.save();

    shopperPromise.then(() => res.json({ redirect: '/maker' }));

    shopperPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Shopper already exists' });
        }
        
        return res.status(400).json({ error: 'An error occured' });
    });
    
    return shopperPromise;
};

const getShoppers = (request, response) => {
    const req = request;
    const res = response;

    return Shopper.ShopperModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occured' });
        }
        
        return res.json({ shoppers: docs });
    });
};

const moneyUpShopper = (req, res) => {
    //console.log(req.body.id);
    
    Shopper.ShopperModel.findById(req.body.id, (err, docs) => {
        if(err){
            console.log(err);
            return res.status(400).json({error: 'An error occured' });
        }
        //console.log(docs);
        if(!docs){
            console.log("fail");
            return res.json({error: 'no shopper found' });
        }
        
        const shopperData = docs;
        shopperData.money+= 10;
        
        const shopperPromise = shopperData.save();
        
        shopperPromise.then(() => res.json({redirect: '/maker' }));
        
        shopperPromise.catch((errr) => {
            console.log(errr);
            return res.status(400).json({error: 'An error occured' });
        });
        return shopperPromise;
    });
    
}

//const StartShopping = (req, res) => {
//    Shopper.ShopperModel.findByOwner(req.session.account._id, (err, docs) => {
//        if (err) {
//            console.log(err);
//            return res.status(400).json({ error: 'An error occurred' });
//        }
//        return res.render('shop', { csrfToken: req.csrfToken(), shoppers: docs });
//    });
//}

module.exports.makerPage = makerPage;
module.exports.getShopper = getShoppers;
module.exports.make = makeShopper;
module.exports.moneyUp = moneyUpShopper;
//module.exports.startShopping = StartShopping;