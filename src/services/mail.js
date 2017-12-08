const config = require('../../config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = function(options) {
	return new Promise((resolve, reject) => {

		sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
		const msg = {
			to: options.to,
			from: 'freemium@cognitiva.la',
			subject: options.subject,
			text: options.text,
			html: '<p></p>',
			templateId: options.templateId,
			substitutions: options.substitutions,
		};
		sgMail
			.send(msg)
			.then(() => resolve(202))
			.catch(error => console.error(error.toString()));


	});
}
