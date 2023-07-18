const authenticate = require('../authenticate')
const db = require('../db');

module.exports = {
    api: async function(req, res) {
        const user = await authenticate.login(req.cookies.user, req.cookies.session);
        const symbol = req.params.symbol;

        if(user) {
            await db.connect(async (db) => {
                let orders = await db.collection('Orders')
                .find({userId: user.id, stockCompany: symbol})
                .sort({ timeStamp: -1 }).map(order => {
                    return {
                        shares: order.shareAmount, price: order.price,
                        time: order.timeStamp, side: order.buyOrSell
                    };
                }).toArray();

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({orders}));
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