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
        return res.status(400).json({ error: 'Name, age, and money are required' });
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

const getCurrentShopper = (req, res) => {
    Shopper.ShopperModel.findById(req.query.id, (err, doc) => {
        if(err){
            console.log(err);
            return res.status(400).json({error: 'An error occured' });
        }
        if(!doc){
            console.log("fail");
            return res.json({error: 'no shopper found' });
        }
        
        return res.json({ shopper: doc });
    });
}

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

const AddToCart = (req, res) => {
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
        shopperData.cart = req.body.cart;
        console.log(shopperData);
        
        const shopperPromise = shopperData.save();
        
        shopperPromise.then(() => res.json({redirect: '/maker' }));
        
        shopperPromise.catch((errr) => {
            console.log(errr);
            return res.status(400).json({error: 'An error occured' });
        });
        return shopperPromise;
    });
}

const EmptyCart = (req, res) => {
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
        
        //removes items from the cart and subtract from money until cart is empty
        while(shopperData.cart.length > 0){
            shopperData.money -= shopperData.cart[shopperData.cart.length - 1].price;
            shopperData.cart.pop();
        }
        
        
        const shopperPromise = shopperData.save();
        
        shopperPromise.then(() => res.json({redirect: '/maker' }));
        
        shopperPromise.catch((errr) => {
            console.log(errr);
            return res.status(400).json({error: 'An error occured' });
        });
        return shopperPromise;
    });
}

const StartShopping = (req, res) => {
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
        //shopperData.money+= 10;
        
        const shopperPromise = shopperData.save();
        
        shopperPromise.then(() => res.json({redirect: '/maker' }));
        
        shopperPromise.catch((errr) => {
            console.log(errr);
            return res.status(400).json({error: 'An error occured' });
        });
        return shopperPromise;
    });
}

module.exports.makerPage = makerPage;
module.exports.getShopper = getShoppers;
module.exports.make = makeShopper;
module.exports.moneyUp = moneyUpShopper;
module.exports.startShopping = StartShopping;
module.exports.getCurrentShopper = getCurrentShopper;
module.exports.addToCart = AddToCart;
module.exports.emptyCart = EmptyCart;