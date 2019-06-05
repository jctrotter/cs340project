var mysql = require('mysql');

var con = mysql.createPool({
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_vaughanh",
    password: "2189"
});

con.on('error', function (err) {
    console.log(` Error occurred: ${err.code}`);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        con.getConnection(function (err) {
            if (err) {
                throw err;
            }
            console.log(" Reconnected to database.");
        });
    }
});

module.exports = con;