$(document).ready(() => {
	$('#search-submit').click(() => {
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
		var route = actionType.concat(`?search=${searchText}`);
		
		// Send AJAX Request //
		$.get(route, (data, status) => {
			window.location.href = route;
		});
	});
});