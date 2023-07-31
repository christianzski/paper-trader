const db = require('../db');
const authenticate = require('../authenticate')


module.exports = {
    api: async function (req, res) {
        try {
            const userAdding = req.body.userAdding;
            const curUser = await authenticate.login(req.cookies.user, req.cookies.session);

            var error = "";
            var status = "failed";

            await db.connect (async (db) => {    

                try{
                    const addUser = await db.collection('Users').findOne({loginId: userAdding});
                    const curUserFriends = await db.collection('Friends').findOne({userId: curUser.id});

                    if(addUser) {
                        const addUserFriends = await db.collection('Friends').findOne({userId: addUser.id});
                        if(!addUserFriends) {
                            await db.collection('Friends').insertOne({inComingReq:[], outGoingReq:[], friendList:[], userId: addUser.id});
                        }
                    } else error = "User does not exist";

                    if(!curUserFriends) {
                        await db.collection('Friends').insertOne({inComingReq:[], outGoingReq:[], friendList:[], userId: curUser.id});
                    } else if(curUserFriends.inComingReq.find(element => element == addUser.loginId) || curUserFriends.outGoingReq.find(element => element == addUser.loginId)) {
                        error = "User already has incoming/outgoing request";
                    } else if(curUserFriends.friendList.find(element => element == addUser.loginId)) {
                        error = 'User is already added';
                    }

                    if(error == "") {
                        await db.collection('Friends').updateOne(
                            {
                                userId:curUser.id
                            },
                            { $push: {outGoingReq: addUser.loginId} }
                        )
                        await db.collection('Friends').updateOne(
                            {
                                userId:addUser.id
                            },
                            { $push: {inComingReq: curUser.loginId} }
                        )
                        status = "A friend request has been sent to the user";
                    }
                }
                catch(e) {
                    error = e.toString();
                }


            });

            ret = {error: error, status: status};

            res.status(200).json(ret);
        } catch(e) {}
    }
}
