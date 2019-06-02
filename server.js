var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var app = express();
var port = process.env.PORT || 3000;

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

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.status(200).render('index');
});

app.get('*', function (req, res) {
    // res.status(404).sendFile(path.join(__dirname,'public', '404.html'))
    res.status(404).render('404');
});

app.listen(port, function() {
    console.log(" Server is listening on port", port);
});