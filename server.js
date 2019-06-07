var express = require('express');
var exphbs = require('express-handlebars');
var mysql = require('mysql');

var app = express();
var port = process.env.PORT || 3000;

// Handlebars Setup //
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Complete Express Setup //
app.use(express.static('public'));



// Database Connection: Change credentials to connect to your server. //
var connection = mysql.createPool({
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_vaughanh",
    password: "2189",
    database: "cs340_vaughanh"
});

// Connect to Database
connection.getConnection(err => {
    if (err) {
        console.log(` The following error has occured while attempting to connect to the database: ${err.code}`);
        return;
    }
    console.log(" Connected to database.");
});

// Reconnect to Database When Disconnected //
connection.on('error', err => {
    if (err) {
        console.log(` The following error has occured: ${err.code}`);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log(" Lost connection to database. Attempting to reconnect...");
            connection.getConnection(err => {
                if (err) {
                    console.log(` The following error has occured while attempting to reconnect to the database: ${err.code}`);
                    return;
                }
                console.log(" Reconnected to database.");
            });
        }
    }
});



// Routes //

// Home Page //
app.get('/', (req, res) => {
    // Render all recipes in the Recipe table //
    connection.query("SELECT * FROM Recipe", (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err.code}`);
            return;
        }

        res.status(200).render('search', {
            recipes: result
        });
    });
});

// Search by Recipe Title Results //
// GET /recipesearch?search=search+text
app.get('/recipesearch', (req, res) => {
    var searchText = req.query.search.split('+').join(' ');
    var searchQuery = `SELECT * FROM Recipe WHERE title LIKE '%${searchText}%'`;

    connection.query(searchQuery, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err.code}`);
            return;
        }

        res.status(200).render('search', {
            recipes: result
        });
    });
});

// Search by Ingredient Name Results //
// GET /ingredientsearch?search=search+text
app.get('/ingredientsearch', (req, res) => {
    var searchText = req.query.search.split('+').join(' ');
    var searchQuery = `SELECT recipe_id, recipe_title AS title, photo FROM recipeIngredientSearch WHERE ingredient_name LIKE '%${searchText}%'`;

    connection.query(searchQuery, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err.code}`);
            return;
        }

        res.status(200).render('search', {
           recipes: result 
        });
    });
});

// Search by Author Results //
// GET /authorsearch?search=search+text
app.get('/authorsearch', (req, res) => {
    var searchText = req.query.search.split('+').join(' ');
    var searchQuery = `SELECT * FROM recipeAuthorSearch WHERE author LIKE '%${searchText}%'`;

    connection.query(searchQuery, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err.code}`);
            return;
        }

        res.status(200).render('search', {
           recipes: result 
        });
    });
});

// Login Page //
app.get('/login', (req, res) => {
    res.status(200).render('login');
});

// Register Page //
app.get('/register', (req, res) => {
    res.status(200).render('register');
});

app.get('/add_recipe.html', (req, res) => {
    res.status(200).render('add_recipe');
});

// Error Page //
app.get('*', (req, res) => {
    // res.status(404).sendFile(path.join(__dirname,'public', '404.html'))
    res.status(404).render('404');
});

// Run Server //
app.listen(port, () => {
    console.log(" Server is listening on port", port);
});