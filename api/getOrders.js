const authenticate = require('../authenticate')
const db = require('../db');

module.exports = {
    api: async function(req, res) {
        const user = await authenticate.login(req.cookies.user, req.cookies.session);
        const symbol = req.query.symbol;
        
        if(user) {
            await db.connect(async (db) => {
                let orders = db.collection('Orders');

                if(symbol == undefined) {
                    orders = orders.find({userId: user.id});
                } else orders = orders.find({userId: user.id, stockCompany: symbol});

                orders = await orders.sort({ timeStamp: -1 }).map(order => {
                    let result = {
                        shares: order.shareAmount, price: order.price,
                        time: order.timeStamp, side: order.buyOrSell
                    };

                    if(symbol == undefined) result.symbol = order.stockCompany;

                    return result;
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