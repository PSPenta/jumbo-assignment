/* eslint-disable import/no-dynamic-require */
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const { response } = require(`${require.main.path}/src/helpers/utils`);

// eslint-disable-next-line consistent-return
exports.validateRequest = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(response(errors.array()));
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal Server Error!'));
  }
};
