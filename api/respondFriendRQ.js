const authenticate = require('../authenticate')
const db = require('../db');

module.exports = {
    api: async function(req, res) {

        let { user, session } = req.cookies;
        let { userName, status } = req.body;
        user = parseInt(user);

        await db.connect(async (db) => {
            //check if the current (=respondUser) is valid, single element
            const respondUser = await authenticate.login(user, session);
            if(respondUser != undefined){   //check if valid

                //get the adder userId from his/her username
                const addUser = await db.collection('Users').findOne({"loginId":userName});

                //access Friends table. 2 separate column
                const respondUserFriend = await db.collection('Friends').findOne({"userId":user});
                const addUserFriend = await db.collection('Friends').findOne({"userId":addUser.id});

                //in order to respond, it must be within the incoming Request
                if(respondUserFriend.inComingReq.find(element => element != addUser.loginId)){
                    //not in inComingReq
                    console.log("user #"+addUser.loginId+", didn't add you");
                    //res.send something back*****
                } else{
                    //being added, start to respond this

                    //take out from the outgoing from addUserFriend
                    await db.collection('Friends').updateOne(
                        {"userId":respondUserFriend.userId},
                        {$pull: {inComingReq: addUser.loginId}}
                    )

                    await db.collection('Friends').updateOne(
                        {"userId":addUserFriend.userId},
                        {$pull: {outGoingReq: respondUser.loginId}}
                    )

                    //check if accecpt -> add to FriendList Both sides
                    if(status == "Accept" || status == "accept"){
                        await db.collection('Friends').updateOne(
                            {"userId":respondUserFriend.userId},
                            {$push: {"friendList": addUser.loginId}}
                        )

                        await db.collection('Friends').updateOne(
                            {"userId":addUserFriend.userId},
                            {$push: {"friendList": respondUser.loginId}}
                        )
                    } 
                    //res.send something back**********
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify("successfully responded"));
                }

            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({error:"user id not auth"}));
            }
        })
    }
}
