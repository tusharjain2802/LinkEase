const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const bcrypt = require('bcryptjs')
const Link = require('../Models/Link');
const passport = require('passport');
const crypto = require('crypto');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/",function(req,res){
    if (!req.session.user) {
      res.redirect('/auth/login'); 
    } else {
      res.render('index', {message:""});
    }
});
app.get("/error",function(req,res){
    res.render("error");
});

app.get("/analytics",function(req,res){
    Link.find({}).then(links=>{
        res.render("analytics",{allLinks:links});
    });
});

app.post("/shorten",function(req,res){
    const original = req.body.original;

    function generateShortUrl(originalUrl) {
        const hash = crypto.createHash('sha256').update(originalUrl).digest('base64');
        const cleanHash = hash.replace(/[^a-zA-Z0-9]/g, '');
        const shortUrl = cleanHash.substring(0, 8);
        return shortUrl;
    }
    const shortUrl = generateShortUrl(original);
    const bool = Link.findOne({shorten:shortUrl}).then(data => {
        if(data){
            res.render("index",{message:"Unable to shorten the link! Try Again."} );
        }
        else{
            const link = new Link({
                original:original,
                shorten:shortUrl,
                visits:0
            });
            link.save();
            res.render("index",{message:shortUrl});
        }
    });
    
});

app.get("/:no",(req,res)=>{
    const enc = req.params.no;
    Link.findOne({shorten:enc}).then(data => {
        if(data){
            data.visits+=1;
            data.save();
            res.redirect(data.original);
        }else{
            res.redirect("/error");
        }
    });
});
  
module.exports = app;