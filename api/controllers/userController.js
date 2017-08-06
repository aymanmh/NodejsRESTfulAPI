/*
    There are two controller one is prone to sql injection (get_a_user)
    and one is not (get_a_user2)
    Note that there should a proper error handling in a real world code, not just throwing 'error'
*/
'use strict';
var myDB = require.main.require("./api/models/userModel");

exports.get_a_user = function (req, res, next) {
    var result = {};
    var id = req.query.id;
    if (id)
        myDB.getUser(id, function (result) {
            if (result !== null)
                res.json(result);
            else
                next(new Error("error"))
        });
    else {
        console.log("id value is missing");
        next(new Error("invalid parameter"));
    }
}

exports.get_a_user2 = function (req, res, next) {
    var result = {};
    var id = req.query.id;
    if (id) //it is good to check if id is a numder using: && (!isNaN(id)
        myDB.getUser2(id, function (result) {
            if (result !== null)
                res.json(result);
            else
                next(new Error("error"))
        });
    else {
        console.log("id value is missing");
        next(new Error("invalid parameter"));
    }

}

exports.add_a_user = function (req, res, next) {
    var name = req.body.name,
        phone = req.body.phone,
        age = req.body.age,
        ssn = req.body.ssn;

    if (name && phone && age && ssn) {
        myDB.adduser(name, phone, age, ssn, function (result) {
            if (result !== null)
                res.json("ok");
            else
                next(new Error("error"));
        });
    }
    else {
        console.log("missing a parameter");
        next(new Error("invalid parameters"));
    }
}

//retun all rows in user table
exports.get_all_users = function (req, res) {
    myDB.getAllUsers(function (result) {
        res.json(result);
    });
}
