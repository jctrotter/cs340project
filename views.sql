-- View for Searching by Ingredient --
CREATE VIEW recipeIngredientSearch AS
	SELECT recipe_id, title AS recipe_title, photo, ingredient_id, name AS ingredient_name
    	FROM RecipeIngredient INNER JOIN Recipe ON recipe_id = Recipe.id
        INNER JOIN Ingredient ON ingredient_id = Ingredient.id;

-- View for Searching by Author --
CREATE VIEW recipeAuthorSearch AS
	SELECT recipe_id, title, photo, username AS author
    	FROM UserRecipe INNER JOIN Recipe ON recipe_id = Recipe.id
        INNER JOIN User ON user_id = User.id;