const db = require('../db')

module.exports = {
    api: async function(req, res) {
        try {
            await db.connect(async (db) => {
                let results = [];
                try {
                    if(req.query.query) {
                        results = await db.collection('CompanyName')
                        .find({"Symbol":{"$regex":"^" + req.query.query + ".*"}})
                        .limit(10).toArray();
                    } else if(req.query.symbol) {
                        results = await db.collection('CompanyName')
                        .find({"Symbol":req.query.symbol})
                        .limit(1).toArray();
                    }
                } catch(e) {}

                res.setHeader('Content-Type', 'application/json');
                res.send(results);
            });
        } catch(e) {}
    }
};