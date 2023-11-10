//jshint esversion:6
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption"
 
const port = 3000; 
const app = express();
 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/userDB'); //mongodb://localhost:27017/nameDB

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//Encrypts the password field and show a binary string instead of the user's password

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});  //Is important to add the plugin before we create the model

const User = mongoose.model("User", userSchema);
 
app.get('/', (req, res) => {
  res.render("home.ejs");
});
 
app.get('/login', (req, res) => {
  res.render('login.ejs');
});
 
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

//Register new user
app.post("/register", async(req, res)=>{
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save()
  .then((result)=>{
    console.log(result);
    res.render("secrets.ejs");
  })
  .catch((error)=>{
    console.log(error)
  });
});

//Users login
app.post("/login", (req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  User.findOne({email: username})
  .then((result)=>{
    if(result){
      if(result.password == password){
        res.render("secrets.ejs");
      }
    }
  })
  .catch((error)=>{
    console.log(error)
    res.render("login.ejs");
  });
});
 
app.listen(port, () => console.log(`Server started at port: ${port}`)
);