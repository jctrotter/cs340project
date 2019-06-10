// npm packages //
var express = require('express');
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var passwordHasher = require('password-hash');
var port = process.env.PORT || 3000;

// Initial Express Setup //
var app = express();

// Handlebars Setup //
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Parsing Setup //
app.use(bodyParser.urlencoded({ extended: false }));        // application/x-www-form-urlencoded
app.use(bodyParser.json());                                 // application/json
app.use(cookieParser());                                    // cookies

// Complete Express Setup //
app.use(express.static('public'));



// Database Connection: Change credentials to connect to your server. //
var connection = mysql.createPool({
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_vaughanh",                                 // make sure to line up with the user in db.sql
    password: "2189",
    database: "cs340_vaughanh"
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
function reconnect() {
    connection.on('error', err => {
        if (err) {
            console.log(` The following error has occured: ${err}`);
            if (err === 'PROTOCOL_CONNECTION_LOST') {
                console.log(" Lost connection to database. Attempting to reconnect...");
                connection.getConnection(err => {
                    if (err) {
                        console.log(` The following error has occured while attempting to reconnect to the database: ${err}`);
                        reconnect();
                    }
                    console.log(" Reconnected to database.");
                    reconnect();
                });
            }
        }
    });
}

reconnect();



// Routes //

// Home Page //
app.get('/', (req, res) => {
    // Render all recipes in the Recipe table //
    connection.query("SELECT * FROM Recipe", (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
            return;
        }
        res.status(200).render('search', {
            recipes: result,
            user: req.cookies['username'],
            loggedIn: (req.cookies['username'] !== "")
        });
    });
});

// Search by Recipe Title Results //
// GET /recipesearch?search=search+text
app.get('/recipesearch', (req, res) => {
    var searchText = req.query.search.split('+').join(' ');
    var searchQuery = `SELECT * FROM Recipe WHERE title LIKE '%${searchText}%'`;
    console.log(searchQuery);

    connection.query(searchQuery, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
            return;
        }
        res.status(200).render('search', {
            recipes: result,
            user: req.cookies['username'],
            loggedIn: (req.cookies['username'] !== "")
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
            return;
        }
        res.status(200).render('search', {
            recipes: result,
            user: req.cookies['username'],
            loggedIn: (req.cookies['username'] !== "")
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
            return;
        }
        res.status(200).render('search', {
            recipes: result,
            user: req.cookies['username'],
            loggedIn: (req.cookies['username'] !== "")
        });
    });
});

// Search by Favorites Results //
// GET /favorites?search=search+text
app.get('/favorites', (req, res) => {
    var searchText = req.query.search;
    if (searchText !== undefined) {
        if (req.cookies['username'] === "") {
            res.redirect('/login');
        } else {
            searchText = searchText.split('+').join(' ');
            var searchQuery = `SELECT * FROM UserFavorite INNER JOIN User ON UserFavorite.user_id = User.id INNER JOIN Recipe ON UserFavorite.recipe_id = Recipe.id WHERE title LIKE '%${searchText}%' AND username = '${req.cookies['username']}'`;
            connection.query(searchQuery, (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to query the database: ${err}`);
                    res.status(500).send(err);
                    return;
                }
                res.status(200).render('search', {
                    recipes: result,
                    user: req.cookies['username'],
                    loggedIn: (req.cookies['username'] !== "")
                });
            });
        }
    } else {
        if (req.cookies['username'] === "") {
            res.redirect('/login');
        } else {
            var searchQuery = `SELECT * FROM UserFavorite INNER JOIN User ON UserFavorite.user_id = User.Id INNER JOIN Recipe ON UserFavorite.recipe_id = Recipe.id WHERE username = '${req.cookies['username']}'`;
            connection.query(searchQuery, (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to query the database: ${err}`);
                    res.status(500).send(err);
                    return;
                }
                res.status(200).render('search', {
                    recipes: result,
                    user: req.cookies['username'],
                    loggedIn: (req.cookies['username'] !== "")
                });
            });
        }
    }
});

// Single Recipe Page //
app.get('/recipe', (req, res) => {
    var recipeId = req.query.id;
    var isFavorite = req.query.isFavorite;

    recipeQuery = `SELECT Recipe.title, Recipe.id, Recipe.photo, User.username FROM Recipe INNER JOIN UserRecipe ON Recipe.id = UserRecipe.recipe_id INNER JOIN User ON UserRecipe.user_id = User.id WHERE Recipe.id = ${recipeId}`;
    stepsQuery = `SELECT Step.num, Step.text FROM Step INNER JOIN RecipeStep ON Step.id = RecipeStep.step_id INNER JOIN Recipe ON RecipeStep.recipe_id = Recipe.id WHERE Recipe.id = ${recipeId}`
    ingredientsQuery = `SELECT RecipeIngredient.amount, Ingredient.name FROM Ingredient INNER JOIN RecipeIngredient ON Ingredient.id = RecipeIngredient.ingredient_id INNER JOIN Recipe ON RecipeIngredient.recipe_id = Recipe.id WHERE Recipe.id = ${recipeId}`
    favoriteQuery = `SELECT * FROM UserFavorite WHERE recipe_id = ${recipeId} AND user_id = (SELECT id FROM User WHERE username = '${req.cookies['username']}')`
    
    var id, title, photoUrl, author, favorite;
    var steps = [], ingredients = [];
    connection.query(recipeQuery, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        }

        id = result[0].id;
        title = result[0].title;
        photoUrl = result[0].photo;
        author = result[0].username;

        connection.query(stepsQuery, (err, result, fields) => {
            if (err) {
                console.log(` The following error occurred while attempting to query the database: ${err}`);
                res.status(500).send(err);
            }

            for (var i = 0; i < result.length; i++) {
                steps.push({
                    "num": result[i].num,
                    "text": result[i].text
                });
            }

            connection.query(ingredientsQuery, (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to query the database: ${err}`);
                    res.status(500).send(err);
                }

                for (var i = 0; i < result.length; i++) {
                    ingredients.push({
                        "amount": result[i].amount,
                        "name": result[i].name
                    });
                }

                connection.query(favoriteQuery, (err, result, fields) => {
                    if (err) {
                        console.log(` The following error occurred while attempting to query the database: ${err}`);
                        res.status(500).send(err);
                    }

                    favorite = result[0] ? true : false;

                    res.status(200).render('recipe', {
                        id: id,
                        title: title,
                        photoUrl: photoUrl,
                        ingredients: ingredients,
                        steps: steps,
                        isFavorite: favorite,
                        user: req.cookies['username'],
                        loggedIn: (req.cookies['username'] !== "")
                    });
                });
            });
        });
    });
});

app.post('/recipe', (req, res) => {
    var user = req.body.currentUser;
    var recipeId = req.body.recipeId;
    var isFavorite = (req.body.isFavorite === "true") ? true : false;

    var userQuery = `SELECT * FROM User WHERE username = '${user}'`;
    connection.query(userQuery, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
            return;
        }
        
        if (!isFavorite) {
            var insertQuery = `IF NOT EXISTS (SELECT * FROM UserFavorite WHERE user_id = ${result[0].id} AND recipe_id = ${recipeId}) THEN INSERT INTO UserFavorite (id, user_id, recipe_id) SELECT (SELECT MAX(id) + 1 FROM UserFavorite), ${result[0].id}, ${recipeId}; END IF;`;
            console.log(" Adding favorite...");
            connection.query(insertQuery, (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to query the database: ${err}`);
                    res.status(500).send(err);
                    return;
                }
                res.redirect(`/recipe?id=${recipeId}`);
            });
        } else {
            var deleteQuery = `IF EXISTS (SELECT * FROM UserFavorite WHERE user_id = ${result[0].id} AND recipe_id = ${recipeId}) THEN DELETE FROM UserFavorite WHERE user_id = ${result[0].id} AND recipe_id = ${recipeId}; END IF;`;
            console.log(" Deleting favorite...");
            connection.query(deleteQuery, (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to query the database: ${err}`);
                    res.status(500).send(err);
                    return;
                }
                res.redirect(`/recipe?id=${recipeId}`);
            });
        }
    });
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
    var query = `SELECT * FROM User WHERE username = '${req.body.username}' AND password = '${req.body.password}'`;
    connection.query(query, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err}`);
            res.status(500).send(err);
        } else if (result[0]){
            console.log(result);
            res.setHeader('Set-Cookie', `username=${username}`);
            res.redirect('/');
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
        res.redirect('/');
    });
});

// Logout //
// GET /logout
app.get('/logout', (req, res) => {
    res.setHeader('Set-Cookie', `username=`);
    res.redirect('/');
})

// Add Recipe Page //
// GET /addrecipe
app.get('/addrecipe', (req, res) => {
    if (req.cookies['username'] != ""){
        // Allow user to access Add Recipe page if logged in
        console.log(req.cookies['username']);
        res.status(200).render('addRecipe');
    } else {
        // Send user to Login page if not logged in
        res.status(200).render('login', {
            user: req.cookies['username']
        });
    }
});

// POST /addrecipe
app.post('/addrecipe', (req, res) => {
    var invalid = false, i;
    // Ensure no ingredient amount fields are empty
    for(i = 0; i < req.body.amt.length; i++) {
        if (req.body.amt[i] == ""){
            console.log(" Amount field empty")
            invalid = true;
        }
    }

    // Ensure no ingredient fields are empty
    for(i = 0; i < req.body.ingredient.length; i++) {
        if (req.body.ingredient[i] == "") {
            console.log(" Ingredient field empty")
            invalid = true;
        }
    }

    // Ensure no step fields are empty
    for(i = 0; i < req.body.step.length; i++){
        if (req.body.step[i] == ""){
            console.log(" Step field empty")
            invalid = true;
        }
    }

    // Ensure title and photo URL fields aren't empty
    if (req.body.recipe_name == "" || req.body.photo_url == "") {
        console.log(" Title or photo URL field(s) empty")
        invalid = true;
    }

    console.log(` Invalid Input: ${invalid}`);

    // Add recipe if all input is valid
    if (!invalid) {
        // Add the recipe
        console.log(" Valid input, generating queries");
        var insertRecipeQuery = `INSERT INTO Recipe (id, title,photo) SELECT (SELECT MAX(id)+1 FROM Recipe), "${req.body.recipe_name}", '${req.body.photo_url}'`;

        // Insert all new ingredients
        var insertIngredientQueries = [];
        for (i = 0; i < req.body.ingredient.length; i++) {
            insertIngredientQueries.push(`INSERT INTO Ingredient (id, name) SELECT MAX(id) + 1, '${req.body.ingredient[i]}' FROM Ingredient`);
        };

        // Insert all RecipeIngredient relations
        var insertRecipeIngredientQueries = [];
        for (i = 0; i < req.body.ingredient.length; i++){
            insertRecipeIngredientQueries.push(`INSERT INTO RecipeIngredient (id, recipe_id, ingredient_id, amount) SELECT (SELECT MAX(id) + 1 FROM RecipeIngredient), (SELECT MAX(id) FROM Recipe), (SELECT id FROM Ingredient WHERE name = '${req.body.ingredient[i]}'), '${req.body.amt[i]}'`);
        }

        // Insert all steps
        var insertStepQueries = [];
        for (i = 0; i < req.body.step.length; i++){
            insertStepQueries.push(`INSERT INTO Step (id, num, text) SELECT MAX(id) + 1, ${i + 1}, '${req.body.step[i]}' FROM Step`);
        }

        // Insert all RecipeStep relations
        var insertRecipeStepQueries = [];
        for (i = 0; i < req.body.step.length; i++){
            insertRecipeStepQueries.push(`INSERT INTO RecipeStep (id, recipe_id, step_id) SELECT (SELECT MAX(id) + 1 FROM RecipeStep), (SELECT MAX(id) FROM Recipe), (SELECT MAX(id) FROM Step)`);
        }

        // Insert UserRecipe relation
        var insertUserRecipeQuery = `INSERT INTO UserRecipe (id, user_id, recipe_id) SELECT (SELECT MAX(id) + 1 FROM UserRecipe), (SELECT id FROM User WHERE username = '${req.cookies['username']}'), (SELECT MAX(id) FROM Recipe)`;
        
        // EXECUTE QUERIES //
        // Insert Recipe //
        connection.query(insertRecipeQuery, (err, result, fields) => {
            if (err) {
                console.log(` The following error occurred while attempting to recipe query the database: ${err}`);
                res.status(500).send(err);
                return;
            }
        });

        // Insert All New Ingredients //
        for (i = 0; i < insertIngredientQueries.length; i++){
            connection.query(insertIngredientQueries[i], (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to ingredient query the database: ${err}`);
                    res.status(500).send(err);
                    return;
                }
            });
        }

        // Insert All RecipeIngredient Relations //
        for (i = 0; i < insertRecipeIngredientQueries.length; i++) {
            connection.query(insertRecipeIngredientQueries[i], (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to recipeingredient query the database: ${err}`);
                    res.status(500).send(err);
                    return;
                }
            });
        }

        // Insert All Steps and RecipeStep Relations //
        for(i = 0; i < insertRecipeStepQueries.length; i++) {
            connection.query(insertStepQueries[i], (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to step query the database: ${err}`);
                    res.status(500).send(err);
                    return;
                }
            });
            connection.query(insertRecipeStepQueries[i], (err, result, fields) => {
                if (err) {
                    console.log(` The following error occurred while attempting to recipestep query the database: ${err}`);
                    res.status(500).send(err);
                    return;
                }
            });
        }

        // Insert UserRecipe Relation //
        connection.query(insertUserRecipeQuery, (err, result, fields) => {
            if (err) {
                console.log(` The following error occurred while attempting to userrecipe query the database: ${err.code}`);
                res.status(500).send(err);
                return;
            }
        });

        // Redirect User to Home Page Upon Successful Recipe Insertion //
        res.redirect('/');
    } else {
        console.log(" Invalid input - please fill in all forms.")
        res.status(200).render('addrecipe', {
            user: req.cookies['username']
        });
    }
});

// Error Page //
app.get('*', (req, res) => {
    res.status(404).render('404', {
        user: req.cookies['username']
    });
});

// Run Server //
app.listen(port, () => {
    console.log(" Server is listening on port", port);
});