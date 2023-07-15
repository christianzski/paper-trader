const db = require('./db')

module.exports = {
    login: async function(user, session) {
        let result = undefined;

        await db.connect(async (db) => {
            const results = await db.collection('Users')
            .find({id: parseInt(user), sessionToken: session}).toArray();

            if(results && results.length > 0) result = results[0];
        });

        return result;
    }
};