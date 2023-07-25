const authenticate = require('../authenticate')
const db = require('../db');
const friendList = require('./friendList');

module.exports = {
    api: async function(req, res) {
        const user = await authenticate.login(req.cookies.user, req.cookies.session);

        if (user) {
            if(req.query.user) {
                let friend = null;
                await db.connect(async (db) => {
                    friend = await friendList.getFriend(db, req.cookies.user, req.query.user);
                });

                res.setHeader('Content-Type', 'application/json');
                
                if(friend) {
                    res.send(JSON.stringify( {user: friend} ));
                } else {
                    res.send(JSON.stringify( {error: "unauthorized"} ));
                }

                return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify( {user} ));
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({error: "unauthorized"}));
        }
    }
};