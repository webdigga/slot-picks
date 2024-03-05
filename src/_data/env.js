const environment = process.env.ENVIRONMENT;
const isProd = environment === 'PROD';
const site = process.env.SITE;

module.exports = {
	environment,
	isProd: isProd,
	site: site
}
