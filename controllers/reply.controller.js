const Thread = require('../models/thread.model.js')
const Reply = require('../models/reply.model')
const bcrypt = require('bcrypt')

const fetch = (req, res) => {
  const threadId = req.query.thread_id
  const board = req.params.board.toLowerCase()
  
  Thread.findById(threadId)
        .populate("replies")
        .exec((err, data) => {
          res.json(data)
        })
}

const create = (req, res) => {
  const threadId = req.body.thread_id
  const board = req.params.board.toLowerCase()
  const { text, delete_password } = req.body
  
  const saltRounds = 12
  const hash = bcrypt.hashSync(delete_password, saltRounds)
  
  const reply = new Reply({
    text,
    delete_password: hash
  })
  reply.save((err, data) => {
    Thread.findOneAndUpdate({_id: threadId}, { $push: { replies: data._id } }, (err, data) => {
      res.redirect(302, `/b/${req.params.board}/${threadId}`)
    })
  })
}

const remove = (req, res) => {
  const threadId = req.body.thread_id
  const replyId = req.body.reply_id
  const pass = req.body.delete_password
  const board = req.params.board.toLowerCase()
  
  Reply.findById(replyId, (err, data) => {
    const hash = data.delete_password
    const check = bcrypt.compareSync(pass, hash)
    
    if (check) {
      data.update({ text: "[deleted]" }, (err, rawResponse) =>  
        res.json("success")
      )
    } else {
      res.json("incorrect password")
    }
  })
  
  // Reply.findByIdAndDelete(replyId, (err, data) => {
  //   Thread.findByIdAndUpdate(threadId, { $pull: { replies: replyId }}, (err, data) => {
  //     res.json("success")
  //   })
  // })
}

const report = (req, res) => {
  const replyId = req.body.reply_id
  
  Reply.findByIdAndUpdate(replyId, { reported: true }, (err, data) => {
    res.json("reported")
  })
}

module.exports = {
  fetch,
  create,
  remove,
  report
}