const db = require('../db');
const authenticate = require('../authenticate');

module.exports = {
    getFriend: async function(db, userId, friendName) {
        try {
            let friends = await db.collection('Friends').findOne({userId: parseInt(userId)});

            if(friends && friends.friendList.indexOf(friendName) >= 0) {
                const friend = await db.collection('Users').findOne({loginId: friendName});

                return {
                    id: friend.id,
                    loginId: friend.loginId,
                    wallet: friend.wallet,
                };
            }

            return null;
        } catch(e) {}
    },

    api: async function (req, res) {
        try {
            const user = await authenticate.login(req.cookies.user, req.cookies.session);
            const login = req.query.user;

            if(user) {
                await db.connect(async (db) => {
                    let result = {friends: [], incoming: [], outgoing: []};
                    let friends = await db.collection('Friends').findOne({"userId": user.id});

                    if(friends) {
                        result.friends = friends.friendList;
                        result.incoming = friends.inComingReq;
                        result.outgoing = friends.outGoingReq;
                    }

                    if(login != undefined) {
                        result.friends = result.friends.filter((name) => name.toLowerCase().indexOf(login) >= 0);
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.send(result);
                });
            }
        } catch(e) {}
    }
}