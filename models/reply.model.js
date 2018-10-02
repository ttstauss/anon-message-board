const mongoose = require('mongoose')

const ReplySchema = new mongoose.Schema({
  text: String,
  created_on: {
    type: Date,
    default: Date.now
  },
  bumped_on: {
    type: Date,
    default: Date.now
  },
  reported: {
    type: Boolean,
    default: false
  },
  delete_password: {
    type: String,
    required: 'Password is required'
  }
})

module.exports = mongoose.model('Reply', ReplySchema)