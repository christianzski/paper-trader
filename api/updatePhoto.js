const db = require('../db');
const authenticate = require('../authenticate')

module.exports = {
    api: async function (req, res) {



        let newPhoto = req.body.newPhoto;
        
        const user = await authenticate.login(req.cookies.user, req.cookies.session);

        console.log(user.loginId);

        var error;
        var status = "failed";

        await db.connect (async (db) => {    

            try{
                await db.collection('Users').updateOne({"loginId" : user.loginId}, {
                    $set:{ photo : newPhoto }
                    
                }
                );
                status = "success";

            }
            catch(e) {
                error = e.toString();
            }


        });

        ret = {error: error, status: status};

        res.status(200).json(ret);
    }
}
