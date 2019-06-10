$(document).ready(() => {
	$('#favorite-star').click(event => {
		event.preventDefault();

		var isFavorite = $('#favorite-button').hasClass('checked');
		if (!isFavorite) {
			console.log("Checking star...");
			$('#favorite-button').addClass('checked');
			$('#favorite-form').append('<input type="hidden" name="isFavorite" value="false" />');
		} else {
			console.log("Unchecking star...");
			$('favorite-button').removeClass('checked');
			$('#favorite-form').append('<input type="hidden" name="isFavorite" value="true" />');
		}

		event.preventDefault();
	});
});