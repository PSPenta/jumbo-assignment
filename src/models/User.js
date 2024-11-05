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
    role: {
      type: String,
      required: true,
      default: 'buyer'
    },
    catalog: {
      type: Schema.Types.ObjectId,
      ref: 'catalog'
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'order'
      }
    ],
    blacklistedTokens: [
      {
        type: String,
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.plugin(aggregatePaginate);
module.exports = model('user', userSchema);
