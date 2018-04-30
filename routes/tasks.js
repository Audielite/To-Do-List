var express = require('express');
var router = express.Router();
var Task = require('../models/task.js');

function isLoggedIn(req, res, next) {
  console.log('user is auth ', req.user)
  if (req.isAuthenticated()) {
    res.locals.username = req.user.local.username;
    next();
  } else {
    res.redirect('/auth')
  }
}

router.use(isLoggedIn);

/* GET home page. */
router.get('/', function(req, res, next) {

  Task.find({ _creator : req.user, completed: false} )
    .then( (tasks) => {
    res.render('index', { title: 'TODO list', tasks: tasks});
  })
    .catch( (err) => {
      next(err);
  });
});

router.get('/completed', function(req, res, next){
  Task.find( {_creator: req.user._id, completed:true} )
  .then( (docs) => {
    res.render('completed_tasks', { title: 'Completed tasks', tasks : docs });
  }).catch( (err) => {
    next(err);
  });
});

router.post('/alldone', function(req, res, next){

  Task.update( {_creator: req.user, completed: false}, {completed: true}, {multi: true})
  .then( (results) => {
    req.flash('info', 'All tasks are done!');
    res.redirect('/')
  })
  .catch( (err) => {
    next(err);
  });

});

router.get('/task/:id', function(req, res, next){
  Task.findById(req.params.id).then( (task) => {
    if (!task){
      res.status(404).send('Task no found');
    }
    else if (!task._creator.equals(req.user._id)){
      res.status(403).send('This is not your task!');
    }
    else {
      res.render('task_detail', {task: task} )
    }

  }).catch( (err) => {
    next(err);
  });

});

router.post('/add', function(req, res, next){
  if (!req.body || !req.body.text) {
    req.flash('error', 'Please enter some text');
    res.redirect('/')
  }

  else {
    var task = Task({ _creator: req.user, text : req.body.text, completed: false});

    task.save()
    .then(() => {
      next(err);
    });
  }

});

router.post('/done', function(req, res, next){

  Task.findOneAndUpdate( {_id: req.body._id, _creator: req.user.id}, {completed: true})
  .then( (task) => {

    if (!task) {
      res.status(403).send('This is not your task!');
    }
    else {
      req.flash('info', 'Task marked as done.');
      res.redirect('/')
    }
  })
  .catch( (err) => {
    next(err);
  });

});

router.post('/delete', function(req, res, next){

  Task.findOneAndRemove( {_id: req.body_id, _creator: req.user.id}, {completed: true} )
  .then( (task) => {
    if (!task) {
    res.status(403).send('This is not your task!');
  }
  else {
    req.flash('info', 'Task deleted');
    res.redirect('/')
  }
})
  .catch( (err) => {
    next(err);
  });

});

router.post('/deleteDone', function(req, res, next){

  Task.deleteMany({completed: true})
    .then( (deleteDone) => {
      if (deleteDone) {
      req.flash('info', 'Completed tasks list cleared!');
      res.redirect('/'); //If preferred, redirect to /completed
    } else {
      var error = new Error('Task Not Found')
      error.status = 404;
      next(error);
    }
    })
    .catch( (err) => {
      next(err);
    });

});

module.exports = router;
