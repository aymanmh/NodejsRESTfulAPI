'use strict';

module.exports = function (app) {
    var userCtrl = require.main.require("./api/controllers/userController");

    //a smoke test for the api
    app.get('/', function (req, res) {
        res.send('Server läuft');
    }
    );

    //version one has the unsecure ugly way of querying the db
    app.route('/api/v1/user')
        .get(userCtrl.get_a_user)

    //version two is the secure proper way of querying db
    app.route('/api/v2/user')
        .get(userCtrl.get_a_user2)
        .post(userCtrl.add_a_user);
        

    /* you might enable this for testing getting all values in table user
        app.route('/api/v2/allusers')
            .get(userCtrl.get_all_users);
    */

    //signal a 404 error for any unhandled path
    app.get('*', function (req, res, next) {
        var err = new Error();
        err.status = 404;
        err.message = "path not found"
        next(err);
    });

    app.use(function (err, req, res, next) {
        // log the error to conslo
        console.log(err);

        res.status(err.status || 400); //if it has no status,set it to 400
        res.send(err.message);

    });
};