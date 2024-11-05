const { Schema, model } = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    score: Number
  },
  {
    timestamps: true
  }
);

userSchema.plugin(aggregatePaginate);
module.exports = model('user', userSchema);
