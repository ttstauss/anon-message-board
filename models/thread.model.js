const mongoose = require('mongoose')

const ThreadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
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
  },
  replies: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Reply'
  }],
  board: {
    type: String,
    required: true
  },
  replycount: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Thread', ThreadSchema)