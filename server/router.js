const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
    app.get('/getShopper', mid.requiresLogin, controllers.Shopper.getShopper);
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);
    app.get('/maker', mid.requiresLogin, controllers.Shopper.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Shopper.make);
    app.post('/moneyUp', mid.requiresLogin, controllers.Shopper.moneyUp);
    app.post('/shop', mid.requiresLogin, controllers.Shopper.startShopping);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
