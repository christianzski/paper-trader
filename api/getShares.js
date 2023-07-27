const quote = require('./quote');
const authenticate = require('../authenticate')
const db = require('../db');

const friendList = require('./friendList')

module.exports = {
    api: async function(req, res) {
        const user = await authenticate.login(req.cookies.user, req.cookies.session);
        const symbol = req.query.symbol;

        if(user) {
            await db.connect(async (db) => {
                if(symbol == undefined) {
                    let id = user.id;

                    if(req.query.user) {
                        const friend = await friendList.getFriend(db, id, req.query.user);
                        if(friend) id = friend.id;
                        else {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({error: "unauthorized"}));
    
                            return;
                        }
                    }
                    
                    const portfolio = await db.collection('Stock').find({portId: id}).map(stock => {
                        return {
                            symbol: stock.companyName,
                            shares: stock.amountShareOwned || 0,
                            price: stock.purchasedPrice || 0
                        };
                    }).toArray();

                    for(let i = 0; i < portfolio.length; ++i) {
                        portfolio[i]["sharePrice"] = (await quote.get_quote(portfolio[i].symbol)).latestPrice;
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({portfolio: portfolio}));
                } else {
                    const portfolio = await db.collection('Stock').findOne({portId: user.id, companyName: symbol});

                    let shares = 0;
                    let price = 0;

                    if(portfolio) {
                        shares = portfolio.amountShareOwned || 0;
                        price = portfolio.purchasedPrice || 0;
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({shares, price}));
                }
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