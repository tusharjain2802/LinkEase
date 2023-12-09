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
      res.render('index', {message:"", allLinks:null});
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

    function generateShortUrl() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 7; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const shortUrl = generateShortUrl();
    const bool = Link.findOne({shorten:shortUrl}).then(data => {
        if(data){
            res.render("index",{message:"Unable to shorten the link! Try Again."} );
        }
        else{
            const link = new Link({
                email:req.body.email,
                original:original,
                shorten:shortUrl,
                visits:0
            });
            link.save();
            Link.find({email:req.body.email}).then(links=>{
            res.render("index",{message:shortUrl, allLinks:links});
        });
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