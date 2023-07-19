const authenticate = require('../authenticate')
const db = require('../db');

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
            await db.connect(async (db) => {
                let watchlist = await db.collection('Watchlist').findOne({userId: user.id});

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({favorites: watchlist?.favorites || []}));
            });
        };
    }
};