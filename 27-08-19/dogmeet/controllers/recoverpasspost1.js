db_connect = require('./db-connect');
mysql = require('mysql');
randombytes = require('randombytes');
send_mail_pass = require('./send_mail_pass');
var Joi = require('@hapi/joi');

con = db_connect();

module.exports = function(req,res){
  console.log("in post");
  if(req.session.sid) {
    var sid = req.session.sid;
  }
  else{
    sid = "0";
  }
  if(req.session.did){
    var did = req.session.did;
  }
  else{
    var did = "0";
  }
  if(req.session.uname) {
    uname = req.session.uname
  }
  else {
    uname = " ";
  }
  if(Object.keys(req.body).length == 1){
    error1 = {};
    var f = 0;
    const schema_email = Joi.object().keys({emailadd: Joi.string().email().required()});
    var txt ='{ "emailadd":"'+req.body.emailadd+'"}';
    var obj = JSON.parse(txt);
    var { error } = Joi.validate(obj, schema_email);
    if (error) {
      error1.emailerr =  mes.message(error);
      //console.log(mes.message(error));
      f = 1;
      res.render('recoverpass', {login:req.session ,uname: " ",status: "", sid: "0", did: "0", page: "", error: error1});
    }
    if(f == 0) {
      console.log("no error");
      con.query("SELECT `users`.`Email` FROM `users` WHERE `users`.`email` = "+mysql.escape(req.body.emailadd), function (err,rows1){
        if(err) throw err;
        if(rows1.length == 0) {
          console.log("email not registered");
          error1.emailerr = "Email Not Registered. Plaese Sign Up";
          res.render('recoverpass', {login:req.session ,uname: " ",status: "", sid: "0", did: "0", page: "", error: error1});
        }
        else if(rows1.length == 1) {
          console.log("email registered");
          var sql = "SELECT `passwordreset`.`id` FROM `passwordreset` WHERE `passwordreset`.`id` = '"+ rows1[0].Email +"'";
          console.log(sql);
          con.query(sql,function(err,rows2) {
            if(rows2.length > 0) {
              console.log("password recovery link already sent");
              var sql = "DELETE FROM `passwordreset` WHERE `passwordreset`.`id` = '"+ rows1[0].Email +"'";
              console.log("delete: ",sql);
              con.query(sql,function(err,response1) {
                if (err) throw err;
                console.log("deleted old links");
                var emailadd = req.body.emailadd;
                emailadd = emailadd.toString();
                var random = randombytes(16);
                //console.log("Random: ",random);
                //console.log("Random2: ",random.toString('hex'));
                var sql = "INSERT INTO `passwordreset`(`id`,`link`) VALUES ('"+ rows1[0].Email +"','"+random.toString('hex')+"')";
                console.log("insert: ", sql);
                con.query(sql,function(err,response2){
                  if(err) throw err;
                  send_mail_pass(emailadd,random.toString('hex'));
                  if(req.session.uname) {
                    if(req.session.sid) {
                      var sid = req.session.sid;
                    }
                    else{
                      sid = "0";
                    }
                    if(req.session.did){
                      var did = req.session.did;
                    }
                    else{
                      var did = "0";
                    }
                    res.render('mailsent', {uname: req.session.uname, status: req.session.status, sid: sid, did: did, login:req.session});
                  }
                  else {
                    res.render('mailsent', {login:req.session ,uname: " ",status: "", sid: "0", did: "0"});
                  }
                })
              })
            }
            else {
              var emailadd = req.body.emailadd;
              emailadd = emailadd.toString();
              var random = randombytes(16);
              var sql = "INSERT INTO `passwordreset`(`id`,`link`) VALUES ('"+rows1[0].Email+"','"+random.toString('hex')+"')";
              console.log("insert2: ",sql);
              con.query(sql,function(err,response2){
                if(err) throw err;
                send_mail_pass(emailadd,random.toString('hex'));
                if(req.session.uname) {
                  if(req.session.sid) {
                    var sid = req.session.sid;
                  }
                  else{
                    sid = "0";
                  }
                  if(req.session.did){
                    var did = req.session.did;
                  }
                  else{
                    var did = "0";
                  }
                  res.render('mailsent', {uname: req.session.uname, status: req.session.status, sid: sid, did: did, login:req.session});
                }
                else {
                  res.render('mailsent', {login:req.session ,uname: " ",status: "", sid: "0", did: "0"});
                }
              })
            }
          })
        }
        else{
          error1.emailerr = "Something Went Wrong!";
          res.render('recoverpass', {login:req.session ,uname: " ",status: "", sid: "0", did: "0", page: "", error: error1});
        }
      })
      //console.log("no error");
    }
  }
  else{
    //console.log("no");
    res.redirect('/');
  }
}
