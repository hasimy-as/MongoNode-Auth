const express = require('express');
const router = express.Router();
const User = require('../models/user');

// get login page
router.get('/', (req, res, next) => {
  res.render('index');
});

// get register page
router.get('/register', (req, res) => {
  res.render('register');
});

// post login/register info
router.post('/', (req, res, next) => {
  if (req.body.password !== req.body.passwordConf) {
    let err = new Error("Password doesn't match!");
    err.status = 400;
    res.send("Password doesn't match!");
    next(err);
  }

  if (
    req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf
  ) {
    let userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf
    };

    User.create(userData, (error, user) => {
      if (error) {
        next(error);
      } else {
        req.session.userId = user._id;
        res.redirect('/profile');
      }
    });
  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(
      req.body.logemail,
      req.body.logpassword,
      (error, user) => {
        if (error || !user) {
          let err = new Error('Wrong email or password!');
          err.status = 401;
          next(err);
        } else {
          req.session.userId = user._id;
          res.redirect('/profile');
        }
      }
    );
  } else {
    let err = new Error('All fields are required!');
    err.status = 400;
    next(err);
  }
});

// GET route to redirect to '/profile' page after registering
router.get('/profile', (req, res, next) => {
  User.findById(req.session.userId).exec((error, user) => {
    if (error) {
      next(error);
    } else {
      if (user === null) {
        setTimeout(function() {
          let err = new Error('Not authorized! Go back!');
          err.status = 400;
          next(err);
        }, 1000);
      } else {
        res.render('hello', {
          show: user
        });
      }
    }
  });
});

// GET for logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy(err => {
      if (err) {
        next(err);
      } else {
        res.redirect('/');
      }
    });
  }
});

//exporting router
module.exports = router;
