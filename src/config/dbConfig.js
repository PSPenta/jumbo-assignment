/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { readdirSync } = require('fs');
const { dirname } = require('path');

/** User define DB Credentials */
const {
  db: {
    noSqlDbConfig
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
} else {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '-> Application is running without database connection!'
  );
  process.exit(0);
}
