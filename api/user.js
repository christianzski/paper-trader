const authenticate = require('../authenticate')
const db = require('../db');

module.exports = {
    api: async function(req, res) {
        
        const user = await authenticate.login(req.cookies.user, req.cookies.session);

        if (user) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify( {user} ));
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({error: "unauthorized"}));
        }

        
    }
};