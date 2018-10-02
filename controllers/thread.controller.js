const Thread = require('../models/thread.model.js')
const Reply = require('../models/reply.model.js')
const bcrypt = require('bcrypt')

const fetch = (req, res) => {
  const board = req.params.board.toLowerCase()
  
  Thread.find({board})
        .populate("replies")
        .exec((err, data) => {
          data.sort((a, b) => new Date(b.bumped_on) - new Date(a.bumped_on))
          data = data.map(item => {
            item.replycount = item.replies.length
            return item
          })
          res.json(data.slice(0, 10))
        })
}

const create = (req, res) => {
  const board = req.params.board.toLowerCase()
  const { text, delete_password } = req.body
  
  const saltRounds = 12
  const hash = bcrypt.hashSync(delete_password, saltRounds)
  
  const thread = new Thread({
    text,
    delete_password: hash,
    board
  })
  thread.save((err, data) => {
    res.redirect(302, `/b/${req.params.board}/`)
  })
}

const remove = (req, res) => {
  const threadId = req.body.thread_id
  const board = req.params.board.toLowerCase()
  const pass = req.body.delete_password
  
  Thread.findById(threadId, (err, data) => {
    const hash = data.delete_password
    const check = bcrypt.compareSync(pass, hash)
    
    if (check) {
      data.remove()
      Reply.deleteMany({ _id: { $in: data.replies }}, (err, data) => {
        res.json("success")
      })
    } else {
      res.json("incorrect password")
    }
  })
}

const report = (req, res) => {  
  const threadId = req.body.report_id
  
  Thread.findByIdAndUpdate(threadId, { reported: true }, (err, data) => {
    res.json("reported")
  })
}

module.exports = {
  fetch,
  create,
  remove,
  report
}