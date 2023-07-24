const db = require('../db');
const authenticate = require('../authenticate');

module.exports = {
    api: async function (req, res) {
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
    }
}