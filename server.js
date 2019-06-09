var express = require('express');
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var passwordHasher = require('password-hash');
var app = express();
var port = process.env.PORT || 3000;

// Handlebars Setup //
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cookieParser())
// Complete Express Setup //
app.use(express.static('public'));

var session_user;

// Database Connection: Change credentials to connect to your server. //
var connection = mysql.createPool({
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_trotterj", //make sure to line up with the user in db.sql
    password: "9288",
    database: "cs340_trotterj"
});

// Connect to Database
connection.getConnection(err => {
    if (err) {
        console.log(` The following error has occured while attempting to connect to the database: ${err}`);
        res.status(500).send(err);
    }
    console.log(" Connected to database.");
});

// Reconnect to Database When Disconnected //
connection.on('error', err => {
    if (err) {
        console.log(` The following error has occured: ${err}`);
        if (err === 'PROTOCOL_CONNECTION_LOST') {
            console.log(" Lost connection to database. Attempting to reconnect...");
            connection.getConnection(err => {
                if (err) {
                    console.log(` The following error has occured while attempting to reconnect to the database: ${err}`);
                    res.status(500).send(err);
                }
                console.log(" Reconnected to database.");
            });
        }
    }
});



// Routes //

// Home Page //
app.get('/index', (req, res) => {
    // Render all recipes in the Recipe table //
    connection.query("SELECT * FROM Recipe", (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
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
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        }

        res.status(200).render('search', {
            title: result.title
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
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
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
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        }
        res.status(200).render('search', {
           recipes: result 
        });
    });
});

app.get('/recipe', (req, res) => {
    var recipeId = req.query.id;
    let query = `SELECT DISTINCT * FROM Recipe WHERE id = ${recipeId}`;
    connection.query(query, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        }
        res.status(200).render('recipe', {
            title: result[0].title
        });
    });
    console.log(recipeId)
    console.log(req.cookies['username'])
    title_id_photo_username_query = `SELECT Recipe.title, Recipe.id, Recipe.photo, User.username FROM Recipe INNER JOIN UserRecipe ON Recipe.id = UserRecipe.recipe_id INNER JOIN User ON UserRecipe.user_id = User.id WHERE Recipe.id = ${recipeId}`
    steps_query = `SELECT Step.num, Step.text FROM Step INNER JOIN RecipeStep ON Step.id = RecipeStep.step_id INNER JOIN Recipe ON RecipeStep.recipe_id = Recipe.id WHERE Recipe.id = ${recipeId}`
    ingredients_query = `SELECT RecipeIngredient.amount, Ingredient.name FROM Ingredient INNER JOIN RecipeIngredient ON Ingredient.id = RecipeIngredient.ingredient_id INNER JOIN Recipe ON RecipeIngredient.recipe_id = Recipe.id WHERE Recipe.id = ${recipeId}`
    favorite_query = `SELECT * FROM UserFavorite WHERE recipe_id = ${recipeId} AND user_id = (SELECT id FROM User WHERE username = '${req.cookies['username']}')`
    connection.query(title_id_photo_username_query, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        }
        else {
            console.log(result)
        }
    });
    connection.query(steps_query, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        }
        else {
            console.log(result)
        }
    });
    connection.query(ingredients_query, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        }
        else {
            console.log(result)
        }
    });
    connection.query(favorite_query, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        }
        else {
            console.log(result)
        }
    });
});

// Add Recipe Page //
// GET /add_recipe
app.get('/add_recipe', (req, res) => {
    if (req.cookies['username'] != ""){
        console.log(req.cookies['username']);
        res.status(200).render('add_recipe');
    } else {
        res.status(200).render('login')
    }
});

// POST /addrecipe
app.post('/addrecipe', (req, res) => {
    //TODO
    //-userrecipe when sessions implemented
    //-double check logic works
    //-handle no entries
    // get our values
        console.log("hello this is body!!!!");
        console.log(req.body.recipe_name);
        console.log(req.body.photo_url);
        console.log(req.body.amt[0]);
        console.log(req.body.ingredient[0]);
        console.log(req.body.step[0]);
        let validate = 0;
        let i;
        for(i = 0; i < req.body.amt.length; i++){
            if (req.body.amt[i] == ""){
                console.log("body invalid")
                validate = 1;
            }
        }
        for(i=0; i < req.body.ingredient.length; i++){
            if (req.body.ingredient[i] == ""){
                console.log("ingredient invalid")
                validate = 1;
            }
        }
        for(i = 0; i < req.body.step.length; i++){
            if (req.body.step[i] == ""){
                console.log("step invalid")
                validate = 1;
            }
        }
        if (req.body.recipe_name == "" || req.body.photo_url == ""){
            console.log("name or photo invalid")
            validate = 1;
        }
    
        console.log(validate)
        if (validate == 0) {
        //add the recipe
        console.log("valid input, running queries.")
        var insert_recipe_query = `INSERT INTO Recipe(id, title,photo) SELECT (SELECT MAX(id)+1 FROM Recipe), "${req.body.recipe_name}", '${req.body.photo_url}'`;
        var insert_ingredient_queries = [];
        for(i = 0; i < req.body.ingredient.length; i++){
            insert_ingredient_queries.push(`INSERT INTO Ingredient(id, name) SELECT MAX(id)+1, '${req.body.ingredient[i]}' FROM Ingredient`);
        };
        var insert_recipeingredient_queries = []
        var working_query;
        for(i = 0; i < req.body.ingredient.length; i++){
            insert_recipeingredient_queries.push(`INSERT INTO RecipeIngredient (id, recipe_id, ingredient_id, amount) SELECT (SELECT MAX(id)+1 FROM RecipeIngredient), (SELECT MAX(id) FROM Recipe), (SELECT id FROM Ingredient WHERE name = '${req.body.ingredient[i]}'), '${req.body.amt[i]}'`);
        }
        var insert_step_queries = [];
        for(i = 0; i < req.body.step.length; i++){
            insert_step_queries.push(`INSERT INTO Step (id, num, text) SELECT MAX(id)+1, ${i+1}, '${req.body.step[i]}' FROM Step`)
        }
        var insert_recipestep_queries = [];
        for(i = 0; i < req.body.step.length; i++){
            insert_recipestep_queries.push(`INSERT INTO RecipeStep (id, recipe_id, step_id) SELECT (SELECT MAX(id)+1 FROM RecipeStep), (SELECT MAX(id) FROM Recipe), (SELECT MAX(id) FROM Step)`);
        }
        var insert_userrecipe_query = `INSERT INTO UserRecipe (id, user_id, recipe_id) SELECT (SELECT MAX(id)+1 FROM UserRecipe), (SELECT id FROM User WHERE username = '${req.cookies['username']}'), (SELECT MAX(id) FROM Recipe)`;
        // ///--------DOING THE QUERIES--------//
        connection.query(insert_recipe_query, (err, result, fields) => {
              if (err) {
                  console.log(` The following error occurred while attempting to recipe query the database: ${err}`);
                  res.status(500).send(err);
              }
          });
        for(i = 0; i < insert_ingredient_queries.length; i++){
            connection.query(insert_ingredient_queries[i], (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to ingredient query the database: ${err}`);
                    res.status(500).send(err);
                }
            });
        };
        for(i = 0; i < insert_recipeingredient_queries.length; i++){
            connection.query(insert_recipeingredient_queries[i], (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to recipeingredient query the database: ${err}`);
                    res.status(500).send(err);
                }
            });
        };
        for(i = 0; i < insert_step_queries.length; i++){
            connection.query(insert_step_queries[i], (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to step query the database: ${err}`);
                    res.status(500).send(err);
                }
            });
            connection.query(insert_recipestep_queries[i], (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to recipestep query the database: ${err}`);
                    res.status(500).send(err);
                }
            });
        };
        connection.query(insert_userrecipe_query, (err, result, fields) => {
            if (err) {
                console.log(` The following error occurred while attempting to userrecipe query the database: ${err.code}`);
                res.status(500).send(err);
            }
        });
        res.redirect('/login');
        }
        else{
            console.log("Invalid input - please fill in all forms.")
            res.status(200).render('add_recipe')
        }
    });

// Login Page //
// GET /login
app.get('/login', (req, res) => {
    res.status(200).render('login');
});

// POST /login
app.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var myquery = `SELECT * FROM User WHERE username = '${req.body.username}' AND password = '${req.body.password}'`;
    connection.query(myquery, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        } else if (result[0]){
            console.log(result);
            res.setHeader('Set-Cookie', `username=${username}`);
            res.redirect('/login');
            //ACCESS USERNAME COOKIE WITH req.cookies['username']
        }
        else {
            console.log(result)
            console.log("invalid username or password")
            res.status(200).render('login');
        }
    })
});

// Register Page //
app.get('/register', (req, res) => {
    res.status(200).render('register');
});

// Register Page //
// POST /register?username=username&password=password
app.post('/register', (req, res) => {
    console.log(req.body);
    var username = req.body.usernameInput;
    var password = req.body.passwordInput;
    var query = `INSERT INTO User SELECT (SELECT MAX(id) + 1 FROM User), '${username}', '${password}'`;
    connection.query(query, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        }
        res.redirect('/login');
    });
});

// Logout //
app.get('/logout', (req, res) => {
    res.setHeader('Set-Cookie', `username=`);
    res.status(200).render('login')
})

// Error Page //
app.get('*', (req, res) => {
    res.status(404).render('404');
});

// Run Server //
app.listen(port, () => {
    console.log(" Server is listening on port", port);
});