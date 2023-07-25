const db = require('../db');
const authenticate = require('../authenticate');
const { useRouter } = require('next/router');


module.exports = {
    api: async function (req, res) {
        const friendDelete = req.body.userDelete;
        const curUser = await authenticate.login(req.cookies.user, req.cookies.session);

        var error;
        var status = "failed";

        await db.connect (async (db) => {    

            try{

                const deletedFriend = await db.collection('Users').findOne({"loginId": friendDelete});

                await db.collection('Friends').updateOne(
                    {"userId":curUser.id},
                    {$pull: {friendList: friendDelete}}
                )

                await db.collection('Friends').updateOne(
                    {"userId":deletedFriend.id},
                    {$pull: {friendList: curUser.loginId}}
                )

                status = 'Friend has been successfully removed.';

            }
            catch(e) {
                error = e.toString();
            }


        });

        ret = {error: error, status: status};

        res.status(200).json(ret);
    }
}