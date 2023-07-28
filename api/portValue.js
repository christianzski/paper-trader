const db = require('../db');
const quote = require('./quote');

module.exports = {
    portValue: async function(time) {
        if((time % 300) == 0){
            await db.connect(async (db) => {

            //make a map to store fetched price
            let priceMap = new Map();
            let users = await db.collection('Users').find({}).toArray();

            for(var i=0; i<users.length; i++){
                
                var portVal = users[i].wallet;
                var lowest = users[i].lowestBalance;
                var highest = users[i].highestBalance;

                var allStockForThisUser = await db.collection('Stock').find({"portId":users[i].id}).toArray();
                var curPort = await db.collection('Portfolio').findOne({"userId":users[i].id});

                //make new port and the port's component for that user
                if(curPort == null || curPort == undefined){
                    var newPort = {
                        userId:users[i].id, portHistoryValueDay:[],portHistoryValueMonth:[]
                    };
                    await db.collection('Portfolio').insertOne(newPort);
                    curPort = newPort;
                }

                for(var j=0; j<allStockForThisUser.length; j++){                    
                   //check if the symbol is in our map
                    //if not fetch, store it
                    if(priceMap.has(allStockForThisUser[j].companyName) == false || priceMap.length==0){
                        var latestPrice = 0;
                        await quote.get_quote(allStockForThisUser[j].companyName).then(result => {
                                latestPrice = result.latestPrice;
                        }).catch(err => {
                            console.log("error in catch")
                        });
                        priceMap.set(allStockForThisUser[j].companyName,latestPrice);
                    }
                    //compute portVal for this stock at this time
                    portVal += (allStockForThisUser[j].amountShareOwned * priceMap.get(allStockForThisUser[j].companyName));            
                }

                if(portVal > highest){
                    //set new highest
                    await db.collection('Users').updateOne(
                        {"id":users[i].id},
                        {$set: {highestBalance:portVal}}
                    )
                }
                if(portVal < lowest){
                    //set new lowest
                    await db.collection('Users').updateOne(
                        {"id":users[i].id},
                        {$set: {lowestBalance:portVal}}
                    )
                }
                var dayCount = curPort.portHistoryValueDay.length;
                
                var monthCount = curPort.portHistoryValueMonth.length
                var newest = [time, portVal];

                var monthFlag = false;
                if ((time%3600)==0) monthFlag = true;
                
                //case 1 both arrays not full, not %3600
                //push newest to day only, don't touch month
                if(dayCount < 288 && monthCount < 720 && !monthFlag){
                    await db.collection('Portfolio').updateOne(
                        {"userId":users[i].id},
                        {$push: {portHistoryValueDay: newest}}
                    )
                } else if (dayCount < 288 && monthCount < 720 && monthFlag) {
                    //case 2 both arrays not full, it is %3600
                    //push newest to both day and month
                    await db.collection('Portfolio').updateOne(
                        {"userId":users[i].id},
                        {
                            $push: {
                                portHistoryValueDay: newest,
                                portHistoryValueMonth: newest}
                        }                    
                    )
                } else if (dayCount == 288 && monthCount < 720 && !monthFlag) {
                    //case 3 day arrays is full, month is not full, not %3600
                    //pop oldest and push newest in day, don't touch month
                    await db.collection('Portfolio').updateOne(
                        {"userId":users[i].id},   
                        {
                            $pop : {portHistoryValueDay:-1},
                            $push: {portHistoryValueDay: newest}
                        }                    
                    )
                } else if (dayCount == 288 && monthCount < 720 && monthFlag){
                    //case 4 day arrays is full, month is not full, it is 3600
                    //pop oldest and push newest in day, push newest in month
                    await db.collection('Portfolio').updateOne(
                        {"userId":users[i].id},
                        {
                            $pop: {portHistoryValueDay:-1},
                            $push: {
                                portHistoryValueDay: newest,
                                portHistoryValueMonth: newest}
                        }                        
                    )
                } else if (dayCount == 288 && monthCount == 720 && !monthFlag) {
                    //case 5 day arrays is full, month is full, not %3600
                    //pop oldest and push newest in day, , don't touch month
                    await db.collection('Portfolio').updateOne(
                        {"userId":users[i].id},
                        {
                            $pop : {portHistoryValueDay:-1},
                            $push: {portHistoryValueDay: newest}
                        }   
                    )
                } else if (dayCount == 288 && monthCount == 720 && monthFlag) {
                    //case 6 day arrays is full, month is full, it is %3600
                    //pop oldest and push newest in day, pop oldest and push newest in month
                    await db.collection('Portfolio').updateOne(
                        {"userId":users[i].id},
                        {
                            $pop: {
                                portHistoryValueDay:-1,
                                portHistoryValueMonth:-1},
                            $push: {
                                portHistoryValueDay: newest,
                                portHistoryValueMonth: newest}
                        }
                    )
                }
                //there will be no case where month is full but day is not full due to length cond
            }
        }
        )}
        
         else {
            console.log("wrong time passed in, not in the 5 min interval")
        }
    }
}
