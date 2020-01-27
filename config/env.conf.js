
import config from './config.json';

export function validateEnvVariables() {

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = config.ENV;
  }
  process.env.TZ = 'Asia/Bangladesh';
  validateNodeEnvironment();

  if (!process.env.SESSION_SECRET)
    process.env.SESSION_SECRET = config.SESSION_SECRET;

  if (!process.env.PORT) {
    if (process.env.NODE_ENV == 'development') {
      process.env.PORT = config.PORT.ADMIN.DEV;
    } else if (process.env.NODE_ENV == 'production') {
      process.env.PORT = config.PORT.ADMIN.PROD;
    }
  }


  validateMongoUri();

  return;
}

function validateNodeEnvironment() {
  switch (process.env.NODE_ENV) {

    case 'development':

      console.log(`Node environment set for ${process.env.NODE_ENV}`);
      break;

    case 'production':

      console.log(`Node environment set for ${process.env.NODE_ENV}`);
      break;

    case 'test':

      console.log(`Node environment set for ${process.env.NODE_ENV}`);
      break;

    default:

      console.log('Error: process.env.NODE_ENV should be set to a valid '
        + ' value such as \'production\', \'development\', or \'test\'.');
      console.log('Value received: ' + process.env.NODE_ENV);
      console.log('Defaulting value for: development');
      process.env.NODE_ENV = 'development';
      break;
  }

  return;
}

// Set the appropriate MongoDB URI with the `config` object
// based on the value in `process.env.NODE_ENV
function validateMongoUri() {

  if (!process.env.MONGO_URI) {

    console.log('No value set for MONGO_URI...');
    console.log('Using the supplied value from config object...')

    switch (process.env.NODE_ENV) {

      case 'development':

        process.env.MONGO_URI = config.MONGO_URI.DEVELOPMENT;
        console.log(`MONGO_URI set for ${process.env.NODE_ENV}`);
        break;

      case 'production':

        process.env.MONGO_URI = config.MONGO_URI.PRODUCTION;
        console.log(`MONGO_URI set for ${process.env.NODE_ENV}`);
        break;

      case 'test':

        process.env.MONGO_URI = config.MONGO_URI.TEST;
        console.log(`MONGO_URI set for ${process.env.NODE_ENV}`);
        break;

      default:

        console.log('Unexpected behavior! process.env.NODE_ENV set to ' +
          'unexpected value!');
        break;
    }
  }

  return;
}
