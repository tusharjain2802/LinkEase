const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const ejs = require("ejs");

const bcrypt = require('bcryptjs')
const User = require('../Models/User');
const passport = require('passport');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/login",function(req,res){
    res.render("login", {message:""});
});

app.get("/register",function(req,res){
    res.render("register", {message:""});
});

app.post('/register', (req, res) => {
//    console.log(req.body.username);
//    console.log(req.body.password);
//    console.log(req.body.email); 
    User.findOne({ email:req.body.email }).then(user => {
        if(user){
            return res.render("register", { message: 'User already exists⚠️ Please choose a different email!' });
        }
        else{
            const plainPassword = req.body.password;
            bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.error('Error generating salt:', err);
                return;
            }
            bcrypt.hash(plainPassword, salt, (err, hash) => {
                if (err) { 
                console.error(err);
                return;
                }
                console.log('Hashed password:', hash);
                const newUser = new User({
                    username:req.body.username,
                    password:hash,
                    email:req.body.email
                });
                newUser.save();
            });
            });
            res.redirect("/auth/login");
        }
    })
    
    
});


app.post('/login', (req, res) => {
    // console.log(req.body.username);
    // console.log(req.body.password);
 
    const plainPassword = req.body.password;

    User.findOne({ email: req.body.email}).then(user => {
    if (user) {
      const hash = user.password;
      bcrypt.compare(plainPassword, hash, (err, result) => {
        if (err) {
            res.render("login",{message:"Password entered is wrong!⚠️"} );
        }
        if(result){
            req.session.user = req.body.email;
            res.redirect("/");
        }else{
            res.render("login",{message:"Password entered is wrong!⚠️"} );
        }
    });

    } else {
        res.render("login",{message:"User not found!⚠️"} );
    }
  })
  .catch(err => {
    console.error('Error finding user:', err);
  });
     
 });
 app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/auth/login');
    });
  });

  

module.exports = app;