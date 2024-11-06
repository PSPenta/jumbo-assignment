/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-dynamic-require */
const { StatusCodes } = require('http-status-codes');
const { verify } = require('jsonwebtoken');
const { model } = require('mongoose');

const { response } = require(`${require.main.path}/src/helpers/utils`);
const { jwt } = require(`${require.main.path}/src/config/serverConfig`);

exports.startGame = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const userId = await this.jwtVerify(token);
    const io = process.socketIO;

    // Ensure player is logged in
    const player = await model('user').findById(userId);
    if (!player) return res.status(StatusCodes.UNAUTHORIZED).send({ error: 'Unauthorized' });

    // Check if there's a waiting player
    if (global.waitingPlayer) {
      if (global.waitingPlayer.userId.toString() === player._id.toString()) {
        return res.status(StatusCodes.OK).send({ message: 'Please wait until another player starts the game!' });
      }

      const opponent = global.waitingPlayer;
      global.waitingPlayer = null;

      // Fetch 6 random questions for the game
      const questions = await model('question').find({});

      // Create a new game document in MongoDB
      const game = await model('game').create({
        players: [player._id, opponent.userId],
        questions: questions.map((q) => q._id),
        scores: { [player._id]: 0, [opponent.userId]: 0 },
        status: 'ongoing'
      });

      // Create a unique room ID
      const roomId = `game-${game._id}`;
      io.to(opponent.socketId).emit('gameMatched', { roomId, gameId: game._id });
      io.to(player.socketId).emit('gameMatched', { roomId, gameId: game._id });

      return res.status(StatusCodes.OK).send({ message: 'Game started', roomId, gameId: game._id });
    }
    // No waiting players, set this player as the waiting player
    global.waitingPlayer = { userId: player._id, socketId: io.id };
    return res.status(StatusCodes.OK).send({ message: 'Waiting for another player..' });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Something went wrong!'));
  }
};

exports.jwtVerify = (token) => new Promise((resolve, reject) => {
  verify(token, jwt.secret, (err, decoded) => {
    if (err) {
      console.error('JWT Error:', err);
      reject('Your login session is either expired or the token is invalid, please try logging in again!');
    }

    if (decoded && decoded.userId && decoded.username) {
      resolve(decoded.userId);
    } else {
      console.error('Token is invalid!');
      reject('You are not authorized to access this page!');
    }
  });
});
