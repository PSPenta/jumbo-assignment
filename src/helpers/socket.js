const { model } = require('mongoose');
const socketIo = require('socket.io');

exports.setup = async (server) => {
  const io = socketIo(server);
  let waitingPlayer = null;

  io.on('connection', (socket) => {
    socket.on('joinGame', async (userId) => {
      if (waitingPlayer) {
        const roomId = `game-${waitingPlayer.id}-${socket.id}`;
        socket.join(roomId);
        waitingPlayer.join(roomId);

        const questions = await model('question').findMany({});

        // Create a new game in MongoDB
        await model('game').create({
          players: [waitingPlayer.userId, userId],
          // eslint-disable-next-line no-underscore-dangle
          questions: questions.map((q) => q._id),
          scores: { [waitingPlayer.userId]: 0, [userId]: 0 }
        });

        io.in(roomId).emit('gameStart', { roomId, questions });
        waitingPlayer = null;
      } else {
        waitingPlayer = socket;
        // eslint-disable-next-line no-param-reassign
        socket.userId = userId;
      }
    });

    socket.on('startQuestionSequence', async ({ roomId, gameId }) => {
      const game = await model('game').findById(gameId).populate('questions');

      // Iterate through each question, emitting one question at a time
      game.questions.forEach((question, index) => {
        setTimeout(() => {
          io.in(roomId).emit('newQuestion', { question, index });
        }, index * 10000); // 10 seconds per question
      });
    });

    // Handling answers from players
    socket.on('submitAnswer', async ({
      roomId, gameId, questionIndex, answer, userId
    }) => {
      const game = await model('game').findById(gameId).populate('questions');
      const question = game.questions[questionIndex];

      if (answer === question.correctAnswer) {
        game.scores.set(userId, (game.scores.get(userId) || 0) + 1);
        await game.save();
      }

      // Check if both players have answered
      if (Object.keys(game.scores).length === 2) {
        io.in(roomId).emit('updateScores', Array.from(game.scores.entries()));
      }
    });

    socket.on('endGame', async ({ roomId, gameId }) => {
      const game = await model('game').findById(gameId);
      game.status = 'completed';
      await game.save();

      const [player1, player2] = game.players;
      const score1 = game.scores.get(player1.toString()) || 0;
      const score2 = game.scores.get(player2.toString()) || 0;

      await model('user').findByIdAndUpdate(player1, { $inc: { score: score1 } });
      await model('user').findByIdAndUpdate(player2, { $inc: { score: score2 } });

      let result;
      if (score1 > score2) {
        result = { winner: player1 };
      } else if (score2 > score1) {
        result = { winner: player2 };
      } else {
        result = { winner: 'draw' };
      }

      io.in(roomId).emit('gameResult', result);

      // Clean up
      io.socketsLeave(roomId);
    });
  });

  return io;
};
