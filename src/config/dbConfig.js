/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-dynamic-require */
const { readdirSync } = require('fs');
const { dirname } = require('path');

/** User define DB Credentials */
const {
  db: {
    noSqlDbConfig,
    sqlDbConfig
  }
} = require('./serverConfig');

const database = process.env.DB_DRIVER || '';

if (database.toLowerCase() === 'mongodb') {
  // Bring in the mongoose module
  const mongoose = require('mongoose');
  const { url: dbURI } = noSqlDbConfig;

  // console to check what is the dbURI refers to
  console.info('Database URL is => ', dbURI);

  // Open the mongoose connection to the database
  mongoose.connect(dbURI, {
    config: {
      autoIndex: false
    }
  });

  // Db Connection
  const Mongoose = mongoose.connection;

  Mongoose.on('connected', () => {
    console.info(`Mongoose connected to ${dbURI}`);
    readdirSync(`${dirname(require.main.filename)}/src/models`).forEach(
      (file) => require(`${dirname(require.main.filename)}/src/models/${file}`)
    );
  });

  Mongoose.on('error', (err) => console.error('\x1B[31m', `=> Mongoose connection error: ${err}`));

  Mongoose.on('disconnected', () => console.warn('\x1b[33m%s\x1b[0m', '-> Mongoose disconnected!'));

  process.on('SIGINT', () => {
    Mongoose.close(() => {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        '-> Mongoose disconnected through app termination!'
      );
      process.exit(0);
    });
  });

  // Exported the database connection which is to be imported at the server
  exports.default = Mongoose;
} else if (database.toLowerCase() === 'sql') {
  // Bring in the sequelize module
  const Sequelize = require('sequelize');

  const {
    name, username, password, host, port, dialect
  } = sqlDbConfig;

  const sequelize = new Sequelize(name, username, password, {
    host,
    port,
    dialect,
    logging: false,
    // Logging false to keep the console clean (change it to true to print all queries in console).
    pool: {
      max: 5,
      min: 1,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });

  sequelize
    .authenticate()
    .then(() => console.info(
      `Sequelize connection started on database "${name}" from "${dialect}"`
    ))
    .catch((err) => console.error('\x1B[31m', `=> Sequelize connection error: ${err}`));

  process.on('SIGINT', () => {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      '-> Sequelize disconnected through app termination!'
    );
    process.exit(0);
  });

  /**
   * Pass name of the model defined in Sequelize Schema and get it imported
   *
   * @param {String} model Name of the model
   *
   * @return {Any} data which is given if it exists or False
   */
  exports.model = (model) => {
    const models = require(`${require.main.path}/src/models`)(
      sequelize,
      Sequelize
    );
    return models[model];
  };

  sequelize
    .sync()
    .then(() => console.info('Sequelize connection synced and relationships established.'))
    .catch((err) => console.error('\x1B[31m', err));

  // Exported the database connection which is to be imported at the server
  exports.default = sequelize;
} else {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '-> Application is running without database connection!'
  );
  process.exit(0);
}
