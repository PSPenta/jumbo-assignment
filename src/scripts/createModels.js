const { SequelizeAuto } = require('sequelize-auto');
require('dotenv').config();

(async () => {
  try {
    // Avoid running the script on the production server
    if (process.env.ENV === 'production') {
      console.error('Please run this script in local environment first and then push the models into the production environment');
      return;
    }

    // Filter out the cli arguments
    const cliArguments = process.argv.slice(2);
    if (cliArguments.length < 1) {
      console.error('Invalid arguments!');
      return;
    }

    // Set up the SequelizeAuto for schema generation and run quickly
    new SequelizeAuto(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      directory: './src/models/',
      port: process.env.DB_PORT,
      lang: 'es5',
      caseModel: 'c',
      caseProp: 'c',
      caseFile: 'c',
      tables: cliArguments,
      noInitModels: true,
      singularize: true
    }).run();
  } catch (error) {
    console.error(error);
  }
})();
