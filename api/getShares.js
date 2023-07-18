const authenticate = require('../authenticate')
const db = require('../db');

module.exports = {
    api: async function(req, res) {
        const user = await authenticate.login(req.cookies.user, req.cookies.session);
        const symbol = req.params.symbol;

        if(user) {
            await db.connect(async (db) => {
                const portfolio = await db.collection('Stock').findOne({portId: user.id, companyName: symbol});

                let shares = 0;
                let price = 0;

                if(portfolio) {
                    shares = portfolio.amountShareOwned || 0;
                    price = portfolio.purchasedPrice || 0;
                }

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({shares, price}));
            }).catch(() => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({error: "server error"}));
            });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({error: "unauthorized"}));
        }
    }
};