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
            const login = req.params.user;

            if(user) {
                await db.connect(async (db) => {
                    
                    let friends = await db.collection('Friends').findOne({"userId": user.id});

                    let result = friends.friendList

                    if(login != undefined) {
                        result = result.filter((name) => name.toLowerCase().indexOf(login) >= 0);
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.send(result);
                });
            }
        } catch(e) {}
    }
}