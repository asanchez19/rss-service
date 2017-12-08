require('dotenv').config()

exports.env = process.env.NODE_ENV || process.env.npm_package_config_env;
exports.httpPort = process.env.PORT || process.env.npm_package_config_httpPort;
exports.httpHost = process.env.HTTP_HOST || process.env.npm_package_config_httpHost;
exports.mongoUrl = process.env.MONGO_URL || process.env.npm_package_config_mongoUrl;
exports.secret = 'meteor';
exports.diasExpiracion = 30;
