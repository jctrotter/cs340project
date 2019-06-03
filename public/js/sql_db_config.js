var mysql = require('msql');

var con = mysql.createConnection({
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_vaughanh",
    password: "2189"
});

con.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connected to database.");
});

module.exports = con;