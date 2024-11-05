const config = {};

/** mongodb connection configuration */
const noSqlDbConfig = {
  url: process.env.DB_URL || 'mongodb://localhost:27017/myDB'
};

const noSqlReplicaSetDbConfig = {
  url1: process.env.DB_URL1 || 'mongodb://localhost:27017/myDB',
  url2: process.env.DB_URL2 || 'mongodb://localhost:27017/myDB',
  url3: process.env.DB_URL3 || 'mongodb://localhost:27017/myDB'
};

/** sql connection configuration */
const sqlDbConfig = {
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  dialect: process.env.DB_DIALECT || 'mysql',
  name: process.env.DB_NAME || 'myDB'
};

const sqlMasterDbConfig = {
  hostMaster: process.env.MASTER_DB_HOST || 'localhost',
  portMaster: process.env.MASTER_DB_PORT || '3306',
  usernameMaster: process.env.MASTER_DB_USER || 'root',
  passwordMaster: process.env.MASTER_DB_PASS || '',
  nameMaster: process.env.MASTER_DB_NAME || 'myDB',
  dialect: process.env.DB_DIALECT || 'mysql'
};

const sqlSlaveDbConfig = {
  hostSlave: process.env.SLAVE_DB_HOST || 'localhost',
  portSlave: process.env.SLAVE_DB_PORT || '3306',
  usernameSlave: process.env.SLAVE_DB_USER || 'root',
  passwordSlave: process.env.SLAVE_DB_PASS || '',
  nameSlave: process.env.SLAVE_DB_NAME || 'myDB'
};

config.db = {
  noSqlDbConfig,
  sqlDbConfig,

  sqlMasterDbConfig,
  sqlSlaveDbConfig,
  noSqlReplicaSetDbConfig
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
