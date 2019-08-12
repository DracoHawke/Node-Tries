var mysql = require('mysql');
var db_connect = require('./db-connect');
mydogs = require('./mydogs');
searchmate = require('./searchmate');
dogdetails = require('./dogdetails');
settings = require('./settings');
location = require('./location');

var con=db_connect();

module.exports = function(req,res,error1,check){
  var sid = 0;
  var did = 0;
  var flag1 = 1;
  if(req.session.sid){sid = 1;}
  if(req.session.did){did = 1;}
  console.log(sid);
  if(req.session.uname){
    if(req.session.status == 0){
      console.log("not verified");
      console.log(sid);
      res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:{},check:"",login:req.session});
    }
    else{
      if(check == "chat"){
        flag1 = 0;
        console.log("redirected to chat");
        res.redirect('/dashboard');
      }
      else if(check == "mydogs"){
        flag1 = 0;
        console.log("redirected to mydogs");
        mydogs(req,res,error1);
      }
      else if(check == "dogdetails"){
        flag1 = 0;
        console.log("redirected to dogdetails");
        dogdetails(req,res,error1)
      }else if(check == "settings"){
        if(sid == 1){
          settings(req,res,error1);
        }
        else{
          res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:{},check:"",login:req.session});
        }
      }
      else if(check == "Location"){
        if(sid == 1){
          location(req,res,error1);
        }
        else{
          res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:{},check:"",login:req.session});
        }
      }
      else if(check == "myacc"){
        console.log("no redirect");
        var sql="SELECT `dogs`.`Did`,`dogs`.`City`,`dogs`.`State`,`dogs`.`Address`,`sitters`.`Description`,`sitters`.`DOB`,`sitters`.`Sid`, `users`.`Fname`, `users`.`Lname`,`users`.`Email`,`users`.`Phone`,`users`.`Profile` FROM `users` LEFT JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` LEFT JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `users`.`Email`="+mysql.escape(req.session.email);
        con.query(sql, function (err, rows, fields) {
          if(err) throw err;
          var send_data=rows[0];
          send_data.status_err='verified';
          if(send_data.DOB != null)
            send_data.DOB = send_data.DOB.replace(/^'(.*)'$/, '$1');
          console.log(send_data);
          if(send_data.Did != null){
            console.log("dogs present");
            res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:send_data,error:error1, check: "myacc",login:req.session});
          }
          else{
            console.log("no dogs?");
            res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:send_data,error:error1, check: "myacc",login:req.session});
          }
        });
      }
    }
  }
  else
    res.redirect('/');
}
