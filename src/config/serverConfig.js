const config = {};

/** mongodb connection configuration */
const noSqlDbConfig = {
  url: process.env.DB_URL || 'mongodb://localhost:27017/myDB'
};

config.db = {
  noSqlDbConfig
};

/** JWT Authentication Credentials */
config.jwt = {
  secret: process.env.JWT_SECRET || 'secret',
  expireIn: process.env.JWT_EXPIRE_IN || '1d',
  algorithm: process.env.JWT_ALGORITHM || 'HS256'
};

config.client = process.env.CLIENT_URL || '*';

/** Swagger Definition */
config.swaggerDefinition = {
  info: {
    title: process.env.APP_TITLE || 'Test Swagger Definition',
    version: process.env.APP_VERSION || '0.0.0',
    description: ''
  },
  host: process.env.APP_HOST || 'localhost:8000',
  basePath: '/api',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header'
    }
  }
};

config.swaggerOptions = {
  customSiteTitle: process.env.APP_TITLE,
  customCss: '',
  customFavIcon: ''
};

module.exports = config;
