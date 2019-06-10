$(document).ready(() => {
	$('#favorite-star').click(event => {
		var checked = $(event.currentTarget).hasClass('checked');
		if (!checked) {
			var userRecipeId = $('#current-user').val().split('+');
			var user = userRecipeId[0];
			var recipeId = userRecipeId[1];
			var route = `/favorite?user=${user}&recipeId=${recipeId}`;

			$.post(route, (data, status) => {
				window.location.href = route;
			});
		}
	});
});