const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const ejs = require("ejs");

var routes = require('./routes/index');
var homeroutes = require('./routes/home'); 
const session = require("express-session");
const passport = require("passport");
const port = 3000 || process.env.PORT

const connectToDatabase = require('./db');

connectToDatabase((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
  }
});

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'tjain2802', 
    resave: false,
    saveUninitialized: true
}));
  
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use('/auth', routes);
app.use('/', homeroutes);



app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})
  