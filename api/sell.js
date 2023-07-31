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
                
                if(results != undefined){
                    const stockList = await db.collection('Stock').find({"portId":user}).toArray();
                    let stockPK = 0; //save when update the info, use as query on updateOne
                    let index = -1;
                    let numShare= 0;
                    let avgPrice = 0;
                    //index = -1 means never have bought this symbol before
                    for(var i=0; i<stockList.length; i++){
                        if(stockList[i].companyName == symbol) {
                            stockPK = stockList[i].id;
                            index = i;
                            numShare = stockList[i].amountShareOwned;
                            avgPrice = stockList[i].purchasedPrice * numShare;

                            break;
                        }
                    }

                    if(shares > numShare || index == -1){
                        //try to sell too much
                        res.setHeader('Content-Type', 'application/json');
                        res.send({error: "Insufficient stock to sell."});
                    } else {
                        //start selling--------------
                        //update more money in user's wallet

                        
                        let newWallet = results.wallet + cost;
                        await db.collection('Users').updateOne({"id":user},{$set: {"wallet": newWallet}});

                        //make Order
                        let currentTime = Date.now();
                        let newOrder = {
                            userId:user, stockCompany:symbol, buyOrSell:"sell", shareAmount:shares, price:latestPrice, timeStamp: currentTime
                        }
                        await db.collection('Orders').insertOne(newOrder);

                        //in onder to sell, must have the data in stock table, update it
                        let remainingShare = numShare - shares;
                        //detect 0 as a range, since it's a double
                        if(remainingShare >= 0 && remainingShare <0.0001){
                            await db.collection('Stock').deleteOne({"id":stockPK});

                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({"success": true, "shares": 0, "price": latestPrice}));
                        } else {
                        //left over share, just update number of remainingShare
                            await db.collection('Stock').updateOne({"id":stockPK},{
                                $set: {
                                "amountShareOwned": remainingShare
                            }});

                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({"success": true, "shares": remainingShare, "price": latestPrice}));
                        }
                    }
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({error:"user id not auth"}));
                }
            })
        } catch(e) {}
    }
};