const authenticate = require('../authenticate')
const db = require('../db');

const friendList = require('./friendList')

module.exports = {
    toggle: async function(req, res) {
        const user = await authenticate.login(req.cookies.user, req.cookies.session);
        const favorite = req.body.favorite;

        if(user) {
            let favorited = false;

            await db.connect(async (db) => {
                let watchlist = await db.collection('Watchlist').findOne({userId: user.id});

                if(watchlist == undefined) {
                    favorited = true;

                    const result = await db.collection('Watchlist').insertOne({
                        userId: user.id,
                        favorites: [favorite]
                    });
                } else {
                    const index = watchlist.favorites.indexOf(favorite);
                    if(index >= 0) {
                        favorited = false;
                        watchlist.favorites.splice(index, 1);
                    } else {
                        favorited = true;
                        watchlist.favorites.push(favorite);
                    }

                    await db.collection('Watchlist').updateOne(
                        {"userId": user.id},
                        {$set: { favorites: watchlist.favorites }});
                }

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({symbol: favorite, favorited: favorited}));
            });
        }
    },

    get: async function(req, res) {
        const user = await authenticate.login(req.cookies.user, req.cookies.session);

        if(user) {
            let id = user.id;

            await db.connect(async (db) => {
                if(req.query.user) {
                    const friend = await friendList.getFriend(db, id, req.query.user);
                    if(friend) id = friend.id;
                    else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({error: "unauthorized"}));

                        return;
                    }
                }

                let watchlist = await db.collection('Watchlist').findOne({userId: id});

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({favorites: watchlist?.favorites || []}));
            });
        };
    }
}