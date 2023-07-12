const db = require('../db')

module.exports = {
    api: async function(req, res) {
        await db.connect(async (db) => {
            const symbol = req.params.symbol;
            const results = await db.collection('CompanyName')
            .find({"Symbol":{"$regex":"^" + symbol + ".*"}})
            .limit(10).toArray();

            res.setHeader('Content-Type', 'application/json');
            res.send(results);
        });
    }
};