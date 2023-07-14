
const { MongoClient } = require("mongodb");

module.exports = {
    connect: async function(callback) {
        
        const url = 'mongodb+srv://' + process.env.DB_NAME + ':' + process.env.DB_PASS + '@cluster0.ukfrryk.mongodb.net/?retryWrites=true&w=majority';

        const client = new MongoClient(url);

        await client.connect();

        const db = client.db("COP4331");
        await callback(db);
    }
};