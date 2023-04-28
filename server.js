//jshint esversion:6
// const bodyParser=require('bodyParser');

//app.use(bodyParser.urlencoded({extended:true}));
// const request=new require('request');
// const express=require("express");
// const app=express();
// app.get("/",function(req,res){
//     res.sendFile(__dirname+"/login.html");
// });
// app.listen(3000,function(){
//     console.log("Server started on port 3000");
// });


const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/sign.html');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
