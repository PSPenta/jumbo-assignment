const { Schema, model } = require('mongoose');

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true
    },
    choices: [{
      type: String
    }],
    answer: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('question', questionSchema);
