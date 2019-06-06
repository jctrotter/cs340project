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

app.get('/index.html', function (req, res) {
    res.status(200).render('index');
})

app.get('/add_recipe.html', function (req, res){
    res.status(200).render('add_recipe');
});

app.get('/register', function (req, res) {
    res.status(200).render('register');
});

app.get('/login', function (req, res) {
    res.status(200).render('login');
});

app.get('*', function (req, res) {
    // res.status(404).sendFile(path.join(__dirname,'public', '404.html'))
    res.status(404).render('404');
});

app.listen(port, function() {
    console.log(" Server is listening on port", port);
});

app.get('/addrecipe', (req, res) => {
// get our values
    var recipe_name = $('#recipe-name').val();
    var recipe_URL = $('#photo-url').val();

    // increase ingredients and steps when respective adds clicked

    var amts = [];
    var ingredients = [];
    var steps = [];

    $('#new-ingredients').children('#amt').each(function () {
        amts.append(this.val())
    });

    $('#new-ingredients').children('#ingredient').each(function () {
        ingredients.append(this.val())
    });

    $('#new-steps').children('#step').each(function () {
        steps.append(this.val())
    });

    //add the recipe
    var insert_recipe_query = `SET @new_recipe_id = (SELECT MAX(id)+1 FROM Recipe); INSERT INTO Recipe(id, title,photo) SELECT @new_recipe_id, ${recipe_name}, ${photo-url}`;
    
    //add the new ingredients
    var insert_ingredient_queries = [];
    let i;
    for(i = 0; i < ingredients.length; i++){
        insert_ingredient_queries.append(`INSERT INTO Ingredient(id, name) SELECT MAX(id)+1, ${ingredients[i]} FROM Ingredient`);
    };

    //add the new recipe ingredient relations and amounts
    var insert_recipeingredient_queries = []
    var working_query;
    for(i = 0; i < ingredients.length; i++){
        working_query = `SET @ingredient_id = (SELECT id FROM Ingredient WHERE name = ${ingredients[i]}); SET @new_recipe_id = (SELECT MAX(id) FROM Recipe);`;
        working_query = working_query + `INSERT INTO RecipeIngredient (id, recipe_id, ingredient_id, amount) SELECT MAX(id)+1, @new_recipe_id, @ingredient_id, ${amts[i]}`
        insert_recipeingredient_queries.append(working_query);
    }

    //add the new steps
    var insert_step_queries = [];
    for(i = 0; i < steps.length; i++){
        insert_step_queries.append(`INSERT INTO Step (id, num, text) SELECT MAX(id)+1, ${i+1}, ${steps[i]} FROM Step`)
    }


    //add the new recipe step relations
    var insert_recipestep_queries = [];
    for(i = 0; i < steps.length; i++){
        insert_recipestep_queries.append(`SET @new_recipe_id = (SELECT MAX(id) FROM Recipe); SET @new_step_id = (SELECT MAX(id) FROM Step); INSERT INTO RecipeStep (id, recipe_id, step_id) SELECT MAX(id)+1, @new_recipe_id, @new_step_id FROM RecipeStep`);
    }


    //set recipe author relation
    var insert_userrecipe_query = `SET @new_recipe_id = (SELECT MAX(id) FROM Recipe); INSERT INTO UserRecipe (id, user_id, recipe_id) SELECT MAX(id)+1, 1, @new_recipe_id FROM UserRecipe`;


    //--------DOING THE QUERIES--------//
    connection.query(insert_recipe_query, (err, result, fields) => {
        if (err) {
            console.log(` The following error occurred while attempting to query the database: ${err.code}`);
            return;
        }
    });

    for(i = 0; i < insert_ingredient_queries.length; i++){
        connection.query(insert_ingredient_queries[i], (err, result, fields) => {
            if (err) {
                console.log(` The following error occurred while attempting to query the database: ${err.code}`);
                return;
            }
        });
    };

    for(i = 0; i < insert_recipeingredient_queries.length; i++){
        connection.query(insert_recipeingredient_queries[i], (err, result, fields) => {
            if (err) {
                console.log(` The following error occurred while attempting to query the database: ${err.code}`);
                return;
            }
        });
    };

    for(i = 0; i < insert_step_queries.length; i++){
        connection.query(insert_step_queries[i], (err, result, fields) => {
            if (err) {
                console.log(` The following error occurred while attempting to query the database: ${err.code}`);
                return;
            }
        });
    };

    for(i = 0; i < insert_recipestep_queries.length; i++){
        connection.query(insert_recipestep_queries[i], (err, result, fields) => {
            if (err) {
                console.log(` The following error occurred while attempting to query the database: ${err.code}`);
                return;
            }
        });
    };

    
});
