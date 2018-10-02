/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

const mongoose = require('mongoose')
mongoose.connect(process.env.DB)

const threadCtrl = require('../controllers/thread.controller')
const replyCtrl = require('../controllers/reply.controller')

module.exports = function (app) {
  
  app.route('/api/threads/:board')
     .get(threadCtrl.fetch)
     .post(threadCtrl.create)
     .delete(threadCtrl.remove)
     .put(threadCtrl.report)
    
  app.route('/api/replies/:board')
     .get(replyCtrl.fetch)
     .post(replyCtrl.create)
     .delete(replyCtrl.remove)
     .put(replyCtrl.report)
};
