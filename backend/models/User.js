const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    // select = Don't return password in queries unless explicitly requested
  },
  { timestamps: true },
);

const User = model('User', userSchema);

module.exports = User;
