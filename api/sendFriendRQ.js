const db = require('../db');
const authenticate = require('../authenticate')


module.exports = {
    api: async function (req, res) {
        const userAdding = req.body.userAdding;
        const curUser = await authenticate.login(req.cookies.user, req.cookies.session);

        var error;
        var status = "failed";

        await db.connect (async (db) => {    

            try{
                const addUser = await db.collection('Users').findOne({loginId: userAdding});
                const curUserFriends = await db.collection('Friends').findOne({userId: curUser.id});

                if(curUserFriends.inComingReq.find(element => element == addUser.loginId) || curUserFriends.outGoingReq.find(element => element == addUser.loginId)) {
                    error = "User already has incoming/outgoing request";
                }
                else if(curUserFriends.friendList.find(element => element == addUser.loginId)
                ) {
                    error = 'User is already added';
                }
                else {
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
    }
}
