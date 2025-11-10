module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('diary').find().toArray((err, result) => {
      if (err) return console.log(err)
      const current = result.find((item) => item.date === decodeURIComponent(req.query.date))
      console.log(current)
      res.render('profile.ejs', {
        user: req.user,
        messages: result,
        current: current
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/createDiaryEntry', (req, res) => {
    db.collection('diary').findOneAndUpdate(
      { date: req.body.date }, //filter
      { $set: { entry1: req.body.entry1, date: req.body.date } }, //how to update
      { upsert: true }, //upsert tells the object if you can't find a matching record, create a new one.
      (err, result) => { //date is storing the 'date' (from profile.ejs) in the database
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect(`/profile?date=${encodeURIComponent(req.body.date)}`)
      })
  })

  app.put('/messages', (req, res) => {
    db.collection('messages').findOneAndUpdate({ entry1: req.body.entry1 }, {
      $set: {
        entry1: req.body.entry1
      }
    }, { upsert: true }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      console.log(result)
      res.redirect('/')
    })
  })

  app.delete('/messages', (req, res) => {
    db.collection('diary').findOneAndDelete({ entry1: req.body.entry1  }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
