async function get_quote(symbol) {
    const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'
    + symbol
    + '?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance');
  
    return await response.json();
}

const authenticate = require('../authenticate')
const db = require('../db');

/*
assume body has 2 parts: symbol
header in the cookies: symbol, cost
*/

module.exports = {
    api: async function(req, res) {

        let { user, session } = req.cookies;
        let { symbol, cost } = req.body;
        let price = '';
        let latestPrice = '';
        user = user*1;
        
        await get_quote(symbol).then(result => {
            price = result['chart']['result']['0']['meta']['regularMarketPrice'];

            res.setHeader('Content-Type', 'application/json');
            if(price.length == 0) {
                console.log("symbol not found")
                res.send(JSON.stringify({error: "Symbol not found"}));
            } else {
                latestPrice = price;
            }
        }).catch(err => {
            console.log("get quote error")
            res.sendStatus(501);
        });

        let numStockWishToSell = cost/latestPrice;

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
                    if(stockList[i].companyName == symbol){
                        stockPK = stockList[i].id;
                        index = i;
                        numShare = stockList[i].amountShareOwned;
                        avgPrice = stockList[i].purchasedPrice * numShare;
                    }
                }

                if(numStockWishToSell > numShare || index == -1){
                    //try to sell too much
                    console.log("insuffeicient stock to sell")
                    res.setHeader('Content-Type', 'application/json');
                    res.send("insuffeicient stock to sell");
                } else {
                    //start selling--------------
                    //update more money in user's wallet

                    
                    let newWallet = results.wallet + cost;
                    await db.collection('Users').updateOne({"id":user},{$set: {"wallet": newWallet}});

                    //make Order
                    let currentTime = Date.now();
                    let newOrder = {
                        userId:user, stockCompany:symbol, buyOrSell:"sell", shareAmount:numStockWishToSell, price:latestPrice, timeStamp: currentTime
                    }
                    await db.collection('Orders').insertOne(newOrder);

                    //in onder to sell, must have the data in stock table, update it
                    let remainingShare = numShare - numStockWishToSell;
                    //detect 0 as a range, since it's a double
                    if(remainingShare >= 0 && remainingShare <0.0001){
                        await db.collection('Stock').deleteOne({"id":stockPK});
                        res.setHeader('Content-Type', 'application/json');
                        res.send("success with "+remainingShare+" shares from "+symbol+" --deleted from stockTable");

                    } else {
                    //left over share, just update number of remainingShare
                        await db.collection('Stock').updateOne({"id":stockPK},{
                            $set: {
                            "amountShareOwned": remainingShare
                        }});

                        res.setHeader('Content-Type', 'application/json');
                        res.send("success with "+remainingShare+" shares from "+symbol);
                    }
                }
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send("user id not auth")
            }
        })
    }
};