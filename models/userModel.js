const mongoose = require('mongoose');

// Create the user model
const UserSchema =  mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        profileUrl: String
    },
    {
        versionKey: false
    }
);
  
const User = mongoose.model('User', UserSchema);

module.exports = User;