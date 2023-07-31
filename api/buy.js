const quote = require('./quote')
const authenticate = require('../authenticate')
const db = require('../db');

/*
assume body has 2 parts: symbol
header in the cookies: symbol, cost
*/

module.exports = {
    api: async function(req, res) {
        try {
            let { user, session } = req.cookies;
            let { symbol, shares } = req.body;
            let price = '';
            let latestPrice = '';

            user = parseInt(user);

            if(isNaN(shares) || !symbol) {
                res.sendStatus(400);
                res.send(JSON.stringify({error: "invalid parameters"}));
                return;
            }
            
            await quote.get_quote(symbol).then(result => {
                res.setHeader('Content-Type', 'application/json');

                if(result.error) {
                    res.send(JSON.stringify(result));
                } else {
                    latestPrice = result.latestPrice;
                }
            }).catch(err => {
                res.sendStatus(501);
            });

            const cost = shares * latestPrice;

            await db.connect(async (db) => {
                //result will have all the information of the user (whole struct user)
                const results = await authenticate.login(user, session);

                if(results != undefined) {
                    if(isNaN(results.wallet) || cost > results.wallet) {
                        //too little fund to buy
                        res.setHeader('Content-Type', 'application/json');
                        res.send({error: "not enough buying power"});
                    } else {
                        //enough buy power--> start buying
                        let newWallet = results.wallet - cost;
                        await db.collection('Users').updateOne({"id": user},{$set: {"wallet": newWallet}});

                        //make order
                        //specify each component in the Order, ignore triggerOrder
                        let currentTime = Date.now();
                        let newOrder = {
                            userId: user, stockCompany:symbol, buyOrSell: "buy", shareAmount:shares,
                            price:latestPrice, timeStamp:currentTime
                        }
                        await db.collection('Orders').insertOne(newOrder);
                        //make stock
                        const portResult = await db.collection('Stock').find({"portId":user, "companyName":symbol}).toArray();
                        //never bought this stock before
                        if(portResult == undefined || portResult.length ==0) {
                            const newStock = {
                                portId:user, companyName:symbol, amountShareOwned:shares, purchasedPrice:latestPrice
                            }
                            await db.collection('Stock').insertOne(newStock);

                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({"success": true, "shares": shares, "avg": latestPrice, "price": latestPrice}));
                        } else {
                            //bought this stock before, update amountShareOwned, update avgPrice
                            let stockPK = portResult[0].id;
                            let numShareTotal = portResult[0].amountShareOwned + shares;
                            let avgPrice = portResult[0].amountShareOwned * portResult[0].purchasedPrice;
                            avgPrice += (shares*latestPrice);
                            avgPrice /= numShareTotal;
                            await db.collection('Stock').updateOne({"id":stockPK},{
                                $set: {
                                "amountShareOwned": numShareTotal,
                                "purchasedPrice": avgPrice
                            }});

                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({"success": true, "shares": numShareTotal, "avg": avgPrice, "price": latestPrice}));
                        }
                    }
                }
                else{
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({error:"user id not auth"}));
                }
            })
        } catch(e) {}
    }
};