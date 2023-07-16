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
            res.sendStatus(501);
            console.log("get quote error")
        });

        await db.connect(async (db) => {
            //result will have all the information of the user (whole struct user)
            const results = await authenticate.login(user, session);
            
            if(results != undefined){

                if(cost > results.wallet) {
                    //too little fund to buy
                    console.log("not enough buying power");
                    res.setHeader('Content-Type', 'application/json');
                    res.send("not enough selling power");
                } else {
                    //enough buy power--> start buying
                    let newWallet = results.wallet - cost;
                    await db.collection('Users').updateOne({"id":user},{$set: {"wallet": newWallet}});

                    //make order
                    //specify each component in the Order, ignore triggerOrder
                    let share = cost/latestPrice;
                    let currentTime = Date.now();
                    let newOrder = {
                        userId:user, stockCompany:symbol, buyOrSell: "buy", shareAmount:share, price:latestPrice, timeStamp:currentTime
                    }
                    await db.collection('Orders').insertOne(newOrder);
                    //make stock
                    const portResult = await db.collection('Stock').find({"portId":user}).toArray();
                    //never bought this stock before
                    let passFlag = false;
                    let avgPrice = latestPrice*share;
                    let numShareTotal = share;

                    for(var i=0; i<portResult.length; i++){
                        if(portResult[i].companyName == symbol){
                            //set flag if found the symbol's stock, compute avg.Price
                            passFlag = true;
                            numShareTotal += portResult[i].amountShareOwned;
                            avgPrice += (portResult[i].amountShareOwned * portResult[i].purchasedPrice);
                            avgPrice /=numShareTotal;
                        }
                    }

                    if(portResult.length ==0 || passFlag == false){
                        //make new stock to this portfolio, make new, id in this has trigger_auto_increment in mongoDB
                        const newStock = {
                            portId:user, companyName:symbol, amountShareOwned:numShareTotal, purchasedPrice:avgPrice
                        }
                        await db.collection('Stock').insertOne(newStock);
                    } else {
                        //bought this stock before, update
                        await db.collection('Stock').updateOne({"companyName":symbol},{
                            $set: {
                            "amountShareOwned": numShareTotal,
                            "purchasedPrice": avgPrice
                        }});
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send("success");
                }
            }
            else{
                res.setHeader('Content-Type', 'application/json');
                res.send("user id not auth")
            }
        })
    }
};