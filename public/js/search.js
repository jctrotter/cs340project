function getRecipeSearch(event) {
	// Get Values from Form //
	var searchType = $('#search-type-select option:selected').text();
	var searchText = $('#search-bar').val().split(' ').join('+');

	// Get Route Type //
	var actionType;
	switch (searchType) {
		case 'Recipe':
			actionType = 'recipesearch';
			break;
		case 'Ingredient':
			actionType = 'ingredientsearch';
			break;
		case 'Author':
			actionType = 'authorsearch';
			break;
		case 'Favorites':
			actionType = 'favorites';
			break;
	}

	// Concatenate Search Text to URI //
	var url = actionType.concat(`?search=${searchText}`);
	console.log(url);
	
	$.get(url, (data, status) => {
		console.log(`URL: ${url}`);
		window.location.href = url;
	});

	// Block Page Refresh Again //
	// event.preventDefault();
}

$(document).ready(() => {
	$('#search-submit').click(getRecipeSearch);
});