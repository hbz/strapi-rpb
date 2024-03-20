// https://github.com/notum-cz/strapi-plugin-content-versioning#%EF%B8%8F-read-before-installation
module.exports = ({ env }) => ({
	"content-versioning": {
		enabled: false,
	},
	'lookup': {
		enabled: true,
		resolve: './src/plugins/lookup'
	},
});