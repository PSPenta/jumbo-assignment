const { Schema, model } = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const blacklistSchema = new Schema(
  {
    token: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  {
    timestamps: true
  }
);

blacklistSchema.plugin(aggregatePaginate);
module.exports = model('blacklist', blacklistSchema);
