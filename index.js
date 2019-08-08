// variable declaration and dependency imports
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const db = require('./mongo');
const port = 8080 | process.env.PORT;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// use express-sessions for tracking logins
server.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

// parse incoming requests
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
server.set('view engine', 'ejs');

// include routes
let routes = require('./routes/router');
server.use('/', routes);

// catch 404 and forward to error handler
server.use((req, res, next) => {
  let err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler, define as the last server.use callback
server.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port
server.listen(port, () => {
  console.log(`Listening in ${port}`);
});
