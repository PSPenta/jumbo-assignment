/* eslint-disable import/no-dynamic-require */
const router = require('express').Router();
const { check } = require('express-validator');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const dependencies = require('./routesDependencies');

const { swaggerDefinition, swaggerOptions } = require(`${require.main.path}/src/config/serverConfig`);
const { response } = require(`${require.main.path}/src/helpers/utils`);

/**
 * @name Swagger Documentation
 * @description This is used for API documentation. It's not mandatory
 */
router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerJsDoc({
      swaggerDefinition,
      apis: [`${require.main.path}/src/routes/*.js`]
    }),
    swaggerOptions
  )
);

// Route for server Health Check
router.get('/health', (req, res) => res.json(response(null, true, { success: true })));

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *      - Authentication
 *    name: Login API
 *    summary: Based on user's data, this api sent jwt token which leads to login process.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          username:
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - username
 *         - password
 *    responses:
 *      200:
 *        description: JWT token will be in response.
 *      500:
 *        description: Internal server error.
 */
router.post(
  '/login',
  [
    check('username').exists().withMessage('The username is mandatory!')
      .isLength({ min: 5, max: 15 })
      .withMessage('The username length must be between 5 and 15 digits!')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,15}$/, 'i')
      .withMessage('The username must contain at least 1 uppercase, 1 lowercase, and 1 number!'),
    check('password', '...')
      .exists().withMessage('The password is mandatory!')
      .isLength({ min: 8, max: 15 })
      .withMessage('The password length must be between 8 and 15 digits!')
      .matches(/^(?=.*\d)(?=.*[!@#$&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$&*]{8,15}$/, 'i')
      .withMessage('The password must contain at least 1 uppercase, 1 lowercase, 1 special character and 1 number!')
  ],
  dependencies.middlewares.requestValidator.validateRequest,
  dependencies.controllers.authClient.jwtLogin
);

/**
 * @swagger
 * /logout:
 *  get:
 *    tags:
 *      - Authentication
 *    name: Logout API
 *    summary: This api terminates the login session of the user whose token is passed.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Param Data
 *        in: param
 *        schema:
 *          type: object
 *    responses:
 *      200:
 *        description: Success message.
 *      403:
 *        description: Unauthorized user.
 *      500:
 *        description: Internal server error.
 */
router.get(
  '/logout',
  dependencies.middlewares.auth.jwtAuth,
  dependencies.controllers.authClient.jwtLogout
);

/**
 * @swagger
 * /register:
 *  post:
 *    tags:
 *      - Authentication
 *    name: Register API
 *    summary: This API let's users register if all the details are valid.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          username:
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - username
 *         - password
 *    responses:
 *      200:
 *        description: JWT token will be in response.
 *      500:
 *        description: Internal server error.
 */
router.post(
  '/register',
  [
    check('username').exists().withMessage('The username is mandatory!')
      .isLength({ min: 5, max: 15 })
      .withMessage('The username length must be between 5 and 15 digits!')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,15}$/, 'i')
      .withMessage('The username must contain at least 1 uppercase, 1 lowercase, and 1 number!'),
    check('password', '...')
      .exists().withMessage('The password is mandatory!')
      .isLength({ min: 8, max: 15 })
      .withMessage('The password length must be between 8 and 15 digits!')
      .matches(/^(?=.*\d)(?=.*[!@#$&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$&*]{8,15}$/, 'i')
      .withMessage('The password must contain at least 1 uppercase, 1 lowercase, 1 special character and 1 number!')
  ],
  dependencies.middlewares.requestValidator.validateRequest,
  dependencies.controllers.authClient.register
);

module.exports = router;
