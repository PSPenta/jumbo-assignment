/* eslint-disable import/no-dynamic-require */
const { compare, hash } = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const { sign } = require('jsonwebtoken');
const { model } = require('mongoose');

const { jwt } = require(`${require.main.path}/src/config/serverConfig`);
const { checkIfDataExists, response } = require(`${require.main.path}/src/helpers/utils`);

exports.jwtLogin = async (req, res) => {
  try {
    const userData = await model('user').findOne({ username: req.body.username });

    let token = '';
    if (userData && await compare(req.body.password, userData.password)) {
      token = sign(
        {
          username: userData.username,
          // eslint-disable-next-line no-underscore-dangle
          userId: userData._id.toString()
        },
        jwt.secret,
        { expiresIn: jwt.expireIn }
      );
    }
    if (token) {
      return res.json(response(null, true, { token }));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response('User not found!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Something went wrong!'));
  }
};

exports.jwtLogout = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json(response('You are not authorized to access this page!'));
    }

    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      await model('blacklist').create({
        token,
        user: req.userId
      });
    }
    return res.json(response(null, true, 'Successfully logged out!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Something went wrong!'));
  }
};

exports.register = async (req, res) => {
  try {
    const data = await model('user').findOne({ username: req.body.username });
    if (checkIfDataExists(data)) {
      return res.status(StatusCodes.BAD_REQUEST).json(response('Username is already taken!'));
    }

    const hashedPassword = await hash(req.body.password, 256);
    const user = await model('user').create({
      username: req.body.username,
      password: hashedPassword,
      score: 0
    });

    if (checkIfDataExists(user)) {
      return res.status(StatusCodes.CREATED).json(response(null, true, { message: 'User added successfully!' }));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response('Something went wrong!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal server error!'));
  }
};
