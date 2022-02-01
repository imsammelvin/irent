const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))

mongoose.connect("mongodb+srv://irentdb:irentdb@cluster0.wyymy.mongodb.net/irentDB", {useNewUrlParser: true});
//mongoose.connect("mongodb://localhost:27017/irentDB", {useNewUrlParser: true});

const postSchema = {
  name: String,
  email: String,
  phone: Number,
  house: String,
  location: String
};

const Post = mongoose.model("Post", postSchema);

let posts = [];
let loca;

app.get("/", function(req, res){
  res.render("home", {
    });
});


app.get("/renthome", function(req, res){

  Post.find({location: loca}, function(err, posts){
    res.render("renthome", { 
      posts: posts 
        
      });
    });

});

app.post("/renthome", function(req, res){

  loca = req.body.selectLocation;


  res.redirect("/renthome");

});


app.get("/addhome", function(req, res){
  res.render("addhome");
});

app.post("/addhome", function(req, res, next){
  const post =  new Post({
    name: req.body.userName,
    email: req.body.userEmail,
    phone: req.body.userPhone,
    house: req.body.houseType,
    location: req.body.userLocation
  });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });

});

/*
app.get("/posts/:userName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.userName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.name);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        name: post.name,
        email: post.email,
        phone: post.phone,
        house: post.house,
        location: post.location
      });
    }
  });

});
*/

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        name: post.name,
        email: post.email,
        phone: post.phone,
        house: post.house,
        location: post.location
      });
    });
  
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
