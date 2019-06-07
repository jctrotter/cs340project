import { strict } from "assert";
import { stringify } from "querystring";

function getRecipeToAdd(event) {
	// get our values
    // var recipe_name = $('#recipe-name').val();
    // var recipe_URL = $('#photo-url').val();

    // increase ingredients and steps when respective adds clicked

    var amts = [];
    var ingredients = [];
    var steps = [];

    // $('#new-ingredients').children('#amt').each(function () {
    //     amts.append(this.val())
    // });

    // $('#new-ingredients').children('#ingredient').each(function () {
    //     ingredients.append(this.val())
    // });

    // $('#new-steps').children('#step').each(function () {
    //     steps.append(this.val())
    // });

    // $.get('/addrecipe', (data, status) => {
	// 	window.location.href = '/addrecipe';
    // });
    
}

$(document).ready(() => {
    $('#recipe-submit').click(getRecipeToAdd);
});
