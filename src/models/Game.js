const { Schema, model } = require('mongoose');

const gameSchema = new Schema(
  {
    players: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }],
    questions: [{
      type: Schema.Types.ObjectId,
      ref: 'question'
    }],
    scores: {
      type: Map,
      of: Number
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: 'ongoing'
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('game', gameSchema);
