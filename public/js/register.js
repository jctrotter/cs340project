$(document).ready(() => {
	$('#register-button').click(event => {
		event.preventDefault();
		
		var emailInput = $('#register-email-input').val();
		var passwordInput = $('#register-password-input').val();
		var passwordVerifyInput = $('#register-password-verify-input').val();
		console.log(`${emailInput}\t${passwordInput}`);

		event.preventDefault();
	});
});