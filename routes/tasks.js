var express = require('express');
var router = express.Router();
var Task = require('../models/task');

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

// create new router
router.post('/add', function(req, res, next){
  if (req.body.text) {
  //create new task
  var t = new Task({text: req.body.text, completed: false})
  //save the task and redirct to home pag if successful
  t.save().then( (newTask) => {
    console.log('The new task created is ', newTask);// for debugging
    res.redirect('/');
  }).catch(()=> {
    next(err); // forward error to the error handlers
  });
}
  else {
    req.flash('error', 'please enter a task.') // Flash an error message
    res.redirect('/'); // And direct to the home page
  }
});

router.post('/done', function(req, res, next){

    Task.findByIdAndUpdate( req.body._id, {completed: true})
    .then( (originalTask) => {
      if (originalTask) {
        req.flash('info', originalTask.text + ' marked as done!');
        res.redirect('/')
      }else {
        var err = new Error('Not found')
        err.status = 404;
        next(err);
      }
    })
    .catch( (err) => {
      next(err);
    })
})

router.get('/completed', function(req, res, next){

  Task.find({completed: true})
    .then( (docs) => {
      res.render('completed_tasks', {tasks: docs});
    })
    .catch( (err) => {
      next(err);
    });
});
// Create a route that deletes individual tasks
router.post('/delete', function(req, res, next){

  Task.findByIdAndRemove(req.body._id)
    .then( (deletedTask) => {
      if (deletedTask) {
        req.flash('info', 'Task deleted.')
        res.redirect('/');
      } else {
        var error = new Error('Task Not Found')
        error.status = 404;
        next(error);
      }
  })
    .catch( (err) => {
      next(err);
    })
});
// Create a route that completes all unfinished tasks
router.post('/alldone', function(req, res, next){

  Task.updateMany({completed: false}, {completed: true})
    .then( () => {
      req.flash('info', 'All tasks are done!');
      res.redirect('/'); //If preferred, redirect to /completed
    })
    .catch( (err) => {
      next(err);
    });

});

router.get('/task/:_id', function(req, res, next){

  Task.findById(req.params._id)
    .then( (doc) => {
      if (doc) {
        res.render('task', {task: doc});
      }
      else {
        next();
        }
      })
      .catch( (err) => {
        next(err);
      });

});
// Create a route that deletes all completed tasks
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

router.post('/add', function(req, res, next){
  if (!reqbody || !req.body.text) {
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

router.get('/completed', function(req, res, next){
  Task.find( {creator: req.user._id, completed:true} )
  .then( (docs) => {
    res.render('tasks_completed', { title: 'Completed tasks', tasks : docs });
  }).catch( (err) => {
    next(err);
  });
});

router.get('/task/:id', function(req, res, next){
  Task.findById(req.params.id).then( (task) => {
    if (!task){
      res.status(404).send('Task no found');
    }
    else {
      res.render('task_detail', {task: task} )
    }
  }).catch( (err) => {
    next(err);
  });
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
    res.status(403).send('This si not your task!');
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
router.post('/alldone', function(req, res, next){

  Task.update( {_creator: req.user, completed: false}, {completed: true}, {multi: true})
  .then( (results) => {
    req.flash('info', 'All tasks are done!');
    res.redirected('/')
  })
  .catch( (err) => {
    next(err);
  });

});

module.exports = router;
