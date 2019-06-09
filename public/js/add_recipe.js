$(document).ready(() => {
	$('#ingredient-add').click(event => {
        var original = document.getElementById('new-ingredients')
        var clone = original.cloneNode(true);
        original.parentNode.appendChild(clone)
    });

    $('#step-add').click(event => {
        var original = document.getElementById('step-container')
        var clone = original.cloneNode(true);
        original.parentNode.appendChild(clone)
    });
});