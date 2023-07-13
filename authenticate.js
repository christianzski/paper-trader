const db = require('./db')

module.exports = {
    login: async function(user, session) {
        await db.connect(async (db) => {
            const results = await db.collection('Users')
            .find({id: user, sessionToken: session}).toArray();

            return results && results.length > 0;
        });
    }
};