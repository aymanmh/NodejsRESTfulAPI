'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./db/myTestDB.db");

//the chance library will generate random db entries
var Chance = require("chance");
var chance = new Chance();

//Check if there is a user table, if not create one, populate it with random date, and log the data to the console
exports.initDB = function () {
    db.get("SELECT * FROM sqlite_master WHERE name ='user' and type='table'",
        function (err, row) {
            if (row === undefined) {
                db.serialize // to ensure the statments are ran sequentially 
                    (
                    function () {
                        db.run("CREATE TABLE user (id INT,name TEXT, phone TEXT,age INT,ssn TEXT)");

                        var stmnt = db.prepare("INSERT INTO user VALUES (?,?,?,?,?)");
                        for (var i = 0; i < 10; i++) {
                            var name = chance.name();
                            var phone = chance.phone();
                            var age = chance.age();
                            var ssn = chance.ssn();
                            stmnt.run(i, name, phone, age, ssn);
                        }
                        stmnt.finalize();

                        db.each("SELECT * FROM user",
                            function (err, row) {
                                if (err !== null)
                                    console.log(err);
                                else
                                    console.log("User id: " + row.id, row.name, row.phone, row.age, row.ssn);
                            });
                    });
            }

        });
}

//the ugly way for querying a db using a user input
exports.getUser = function (id, callback) {
    db.all("SELECT * FROM user WHERE id =" + id,
        function (err, row) {
            if (err === null)
                callback(row);
            else
                callback(null);
        }
    );
}

//the proper way of db access to avoid sql injections
exports.getUser2 = function (id, callback) {
    var stmnt = db.prepare("SELECT * FROM user WHERE id =?");

    stmnt.get(id,
        function (err, row) {
            if (err === null && row !== undefined)
                callback(row);
            else
                callback(null);
        });

    stmnt.finalize();
}

exports.adduser = function (name, phone, age, ssn, callback) {
    var stmnt = db.prepare("SELECT MAX(id) as 'id' FROM user");
    stmnt.get(
        function (err, result) {
            stmnt = db.prepare("INSERT INTO user VALUES (?,?,?,?,?)");
            var id = Number(result.id);
            stmnt.run(++id, name, phone, age, ssn, function (err) {
                if (err) {
                    console.log(err);
                    callback(null);
                }
                else
                    callback("ok");

            }
            );
        }
    );
}

exports.getAllUsers = function (callback) {
    db.all("SELECT * FROM user",
        function (err, row) {
            callback(row);
        });
}

exports.closeDB = function () {
    db.close();
}