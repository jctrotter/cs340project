SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Table structure for table `Recipe`
--
CREATE TABLE `Recipe` (
    `id`        INT             NOT NULL,
    `title`     VARCHAR(100)    NOT NULL,
    `photo`     VARCHAR(256)    DEFAULT 'https://media.istockphoto.com/photos/culinary-background-with-spices-and-recipe-book-picture-id607299402?k=6&m=607299402&s=612x612&w=0&h=eLARAbW9C2YYRCm2FXxn1yyfTVoKuKyhOvhKv0EEZl8=',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Populate `Recipe` table with initial values
--
INSERT INTO `Recipe` (`id`, `title`) VALUES
    (1, 'Mac & Cheese'),
    (2, 'Side Salad'),
    (3, 'Cheese Pretzels'),
    (4, 'Homemade Pepperoni Pizza'),
    (5, 'Mango Lemonade'),
    (6, 'Banana Bread'),
    (7, 'Chicken Burritos'),
    (8, 'Teriyaki Chicken'),
    (9, 'Onion Rings'),
    (10, 'Chocolate Chip Cookies');

-- ------------------------------------------------------------------

--
-- Table structure for table `Ingredient`
--
CREATE TABLE `Ingredient` (
    `id`    INT             NOT NULL,
    `name`  VARCHAR(60),
    PRIMARY KEY (`id`),
    UNIQUE (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Populate `Ingredient` table with initial values
--
INSERT INTO `Ingredient` VALUES
    (1, 'Elbow noodles'),
    (2, 'Cheese'),
    (3, 'Lettuce'),
    (4, 'Carrots'),
    (5, 'Red Onion'),
    (6, 'Ranch Dressing'),
    (7, 'Croutons'),
    (8, 'Pretzel Dough'),
    (9, 'Pizza Dough'),
    (10, 'Pizza Sauce'),
    (11, 'Pepperoni'),
    (12, 'Lemons'),
    (13, 'Sugar'),
    (14, 'Water'),
    (15, 'Mango Syrup'),
    (16, 'Flour'),
    (17, 'Salt'),
    (18, 'Baking Soda'),
    (19, 'Vanilla'),
    (20, 'Bananas'),
    (21, 'Chicken'),
    (22, 'Beans'),
    (23, 'Rice'),
    (24, 'Cilantro'),
    (25, 'Salsa'),
    (26, 'Teriyaki Sauce'),
    (27, 'Onions'),
    (28, 'Eggs'),
    (29, 'Bread Crumbs'),
    (30, 'Chocolate Chip Cookie Dough Mix'),
    (31, 'Butter');

-- ------------------------------------------------------------------

--
-- Table structure for table `RecipeIngredient`
--
CREATE TABLE `RecipeIngredient` (
    `id`                INT             NOT NULL,
    `recipe_id`         INT             NOT NULL,
    `ingredient_id`     INT             NOT NULL,
    `amount`            VARCHAR(30),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`recipe_id`) REFERENCES `Recipe` (`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`ingredient_id`) REFERENCES `Ingredient` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Populate `RecipeIngredient` table with initial values
--
INSERT INTO `RecipeIngredient` VALUES
    (1, 1, 1, '1 box'),
    (2, 1, 2, '2 cups'),
    (3, 2, 3, '2 cups'),
    (4, 2, 4, '1 cup'),
    (5, 2, 5, '1/2'),
    (6, 2, 6, '2 tbsp'),
    (7, 2, 7, '1/2 cup'),
    (8, 3, 8, '1 package'),
    (9, 3, 2, '1/2 cup'),
    (10, 4, 9, '1 package'),
    (11, 4, 2, '1 cup'),
    (12, 4, 10, '4 tbsp'),
    (13, 4, 11, '1 cup'),
    (14, 5, 12, '3'),
    (15, 5, 13, '1 cup'),
    (16, 5, 14, '1 quart'),
    (17, 5, 15, '2 tbsp'),
    (18, 6, 16, '1 1/2 cups'),
    (19, 6, 17, '1 tsp'),
    (20, 6, 18, '1 tsp'),
    (21, 6, 19, '1 tsp'),
    (22, 6, 20, '2-3'),
    (23, 7, 21, '2 lbs'),
    (24, 7, 22, '1 can'),
    (25, 7, 23, '1/2 cup, cooked'),
    (26, 7, 24, '1 tbsp'),
    (27, 7, 25, '1 cup'),
    (28, 7, 2, '2 cups'),
    (29, 8, 21, '2 lbs'),
    (30, 8, 26, '1/2 cup'),
    (31, 9, 27, '1'),
    (32, 9, 28, '2 large'),
    (33, 9, 29, '2 cups'),
    (34, 10, 30, '1 package'),
    (35, 10, 28, '1 large'),
    (36, 10, 31, '1 stick');

-- ------------------------------------------------------------------

--
-- Table structure for table `Step`
--
CREATE TABLE `Step` (
    `id`    INT             NOT NULL,
    `num`   INT             NOT NULL,
    `text`  VARCHAR(255)    NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Populate `Step` table with initial values
--
INSERT INTO `Step` VALUES
    (1, 1, 'Boil the entire package of elbow noodles for 10 minutes.'),
    (2, 2, 'Add the cheese, stir until combined, then let simmer for another 2 minutes.'),
    (3, 3, 'Pour mac and cheese into a bowl and serve.'),
    (4, 1, 'Chop the lettuce, carrots, and onion and mix in a bowl.'),
    (5, 2, 'Add croutons and ranch dressing on the veggie mixture and serve.'),
    (6, 1, 'Roll the pretzel dough into a long rope, then twist into the classic pretzel shape.'),
    (7, 2, 'Put shaped pretzels onto a baking sheet, sprinkle with cheese, then cook in the oven for 20 minutes.'),
    (8, 3, 'Take the pretzels out of the oven, let cool, then serve with your favorite dip.'),
    (9, 1, 'Shape the pizza dough into a flat disk like a standard pizza.'),
    (10, 2, 'Take a spoon and swirl pizza sauce across the flattened pizza dough.'),
    (11, 3, 'Sprinkle cheese on top of the pizza after all desired sauce has been added.'),
    (12, 4, 'Carefully place the pepperoni slices across the surface of the cheesed pizza.'),
    (13, 5, 'Put the pizza onto a baking sheet, then cook in the oven for 10 minutes.'),
    (14, 6, 'Take the pizza out of the oven, cut into slices, and serve.'),
    (15, 1, 'Squeeze the lemons into a pitcher, then fill the rest of the way with water.'),
    (16, 2, 'Add the sugar and mango syrup, stir, and enjoy.'),
    (17, 1, 'Mash the bananas in a bowl.'),
    (18, 2, 'Add the flour, baking soda, eggs, vanilla, and sugar, then combine.'),
    (19, 3, 'Pour the banana bread dough into a buttered bread pan, then bake in the oven for 1 hour.'),
    (20, 4, 'Take out of the oven, let cool, slice, then serve and enjoy.'),
    (21, 1, 'Cut the chicken into one-inch cubes, then cook in an oiled pan for 7 minutes.'),
    (22, 2, 'Add taco seasoning to the chicken for flavoring.'),
    (23, 3, 'Cook the rice and drain the beans.'),
    (24, 4, 'Preheat a tortilla, then add the chicken, rice, beans, cheese, and cilantro.'),
    (25, 5, 'Wrap the tortilla into a burrite, serve, and enjoy.'),
    (26, 1, 'Cut the chicken into one-inch cubes, then cook in an oiled pan for 7 minutes.'),
    (27, 2, 'Add the teriyaki to the chicken and let simmer for another 2-3 minutes.'),
    (28, 3, 'Serve the teriyaki chicken over rice and enjoy.'),
    (29, 1, 'Chop the onion and separate into rings.'),
    (30, 2, 'Prepare an egg mixture in a bowl, then add the bread crumbs into a different bowl.'),
    (31, 3, 'For each onion ring, dip in the egg mixture then in the bread crumbs, repeat, then let fry in a pot of hot oil.'),
    (32, 4, 'When the onion ring is golden brown and crispy, take out of the oil, let cool, and pat dry.'),
    (33, 5, 'Serve with your favorite dip and enjoy.'),
    (34, 1, 'Pour the chocolate chip cookie dough dry mixture to a bowl.'),
    (35, 2, 'Add the egg and butter to the dry mixture and combine.'),
    (36, 3, 'Scoop into one-inch spheres, then line up one inch apart on a greased baking sheet.'),
    (37, 4, 'Put the cookie dough in the oven and let bake for 10 minutes.'),
    (38, 5, 'Take the cookies out of the oven, let cool, then serve and enjoy.');

-- ------------------------------------------------------------------

--
-- Table structure for table `RecipeStep`
--
CREATE TABLE `RecipeStep` (
    `id`            INT     NOT NULL,
    `recipe_id`     INT     NOT NULL,
    `step_id`       INT     NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`recipe_id`) REFERENCES `Recipe` (`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`step_id`) REFERENCES `Step` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Populate `RecipeStep` table with initial values
--
INSERT INTO `RecipeStep` VALUES
    (1, 1, 1),
    (2, 1, 2),
    (3, 1, 3),
    (4, 2, 4),
    (5, 2, 5),
    (6, 3, 6),
    (7, 3, 7),
    (8, 3, 8),
    (9, 4, 9),
    (10, 4, 10),
    (11, 4, 11),
    (12, 4, 12),
    (13, 4, 13),
    (14, 4, 14),
    (15, 5, 15),
    (16, 5, 16),
    (17, 6, 17),
    (18, 6, 18),
    (19, 6, 19),
    (20, 6, 20),
    (21, 7, 21),
    (22, 7, 22),
    (23, 7, 23),
    (24, 7, 24),
    (25, 7, 25),
    (26, 8, 26),
    (27, 8, 27),
    (28, 8, 28),
    (29, 9, 29),
    (30, 9, 30),
    (31, 9, 31),
    (32, 9, 32),
    (33, 9, 33),
    (34, 10, 34),
    (35, 10, 35),
    (36, 10, 36),
    (37, 10, 37),
    (38, 10, 38);

-- ------------------------------------------------------------------

--
-- Table structure for table `User`
--
CREATE TABLE `User` (
    `id`        INT             NOT NULL,
    `username`  VARCHAR(30)     NOT NULL,
    `password`  VARCHAR(60)     NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Populate `User` table with initial values
--
INSERT INTO `User` VALUES
    (1, 'MuffinMan', 'muffinsrcool98'),
    (2, 'idkwhatimdoing', 'sendhalp'),
    (3, 'BakingFor83', 'whydoihavesomanykids'),
    (4, 'CookingScrub97', 'ionlyeatramen'),
    (5, 'CatsRCool', 'woof'),
    (6, 'DogsRRad', 'meow'),
    (7, 'healthyboi', 'ionlyeatkale'),
    (8, 'wowza', 'whoa'),
    (9, 'WhatIsAKitchen', 'ihavenevercookedinmylife'),
    (10, 'Cooking4LYF', 'ihaveliterallyneverseentheoutsideofmykitchen');

-- ------------------------------------------------------------------

--
-- Table structure for table `UserRecipe`
--
CREATE TABLE `UserRecipe` (
    `id`            INT     NOT NULL,
    `user_id`       INT     NOT NULL,
    `recipe_id`     INT     NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`recipe_id`) REFERENCES `Recipe` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Populate `UserRecipe` table with initial values
--
INSERT INTO `UserRecipe` VALUES
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 3),
    (4, 4, 4),
    (5, 5, 5),
    (6, 5, 6),
    (7, 5, 7),
    (8, 8, 8),
    (9, 9, 9),
    (10, 10, 10);

-- ------------------------------------------------------------------

--
-- Table structure for table `UserFavorite`
--
CREATE TABLE `UserFavorite` (
    `id`            INT     NOT NULL,
    `user_id`       INT     NOT NULL,
    `recipe_id`     INT     NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`recipe_id`) REFERENCES `Recipe` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Populate `UserFavorite` table with initial values
--
INSERT INTO `UserFavorite` VALUES
    (1, 1, 10),
    (2, 2, 9),
    (3, 3, 8),
    (4, 4, 7),
    (5, 5, 6),
    (6, 6, 5),
    (7, 7, 4),
    (8, 7, 3),
    (9, 7, 2),
    (10, 9, 1);

COMMIT;

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

-- Procedure to Update Search Views --
DELIMITER $$
CREATE DEFINER=`cs340_vaughanh`@`%` PROCEDURE `updateSearchViews`()
    NO SQL
BEGIN
	DROP VIEW recipeIngredientSearch;
    CREATE VIEW recipeIngredientSearch AS
		SELECT recipe_id, title AS recipe_title, photo, ingredient_id, name AS ingredient_name
    			FROM RecipeIngredient INNER JOIN Recipe ON recipe_id = Recipe.id
        		INNER JOIN Ingredient ON ingredient_id = Ingredient.id;
    
    DROP VIEW recipeAuthorSearch;
    CREATE VIEW recipeAuthorSearch AS
		SELECT recipe_id, title, photo, username AS author
    	FROM UserRecipe INNER JOIN Recipe ON recipe_id = Recipe.id
        INNER JOIN User ON user_id = User.id;
END$$
DELIMITER ;