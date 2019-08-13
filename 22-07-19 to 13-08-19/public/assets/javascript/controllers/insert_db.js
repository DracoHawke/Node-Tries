var mysql = require('mysql');
var db_connect = require('./db-connect');
var bcrypt = require('bcryptjs');
send_mail = require('./send_mail');
insert_sitter = require('./insert_sitter');
const fileUpload = require('express-fileupload');
var fs = require('fs');

global.res='';
var con=db_connect();

module.exports=function(req,res){
  val=req.body;
  var id='';
  function get_info(val, callback){
    const hash = bcrypt.hashSync(val.password, 10);
    var oldpath = req.files.fileUpload.path;
    var newpath = 'users/' +req.body.email+'_'+req.files.fileUpload.name;
    var newpath2 = 'public/users/' +req.body.email+'_'+req.files.fileUpload.name;
    var sql = "INSERT INTO `users`( `Fname`,`Lname`,`Email`, `U_Password`,`Phone`,`Profile`,`status`) VALUES ("+mysql.escape(val.fname)+","+mysql.escape(val.lname)+","+mysql.escape(val.email)+","+mysql.escape(hash)+","+mysql.escape(val.phone)+","+mysql.escape(newpath)+",'0')";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err){
        console.log(err.code);
        if(err.code=='ER_DUP_ENTRY') {
          console.log('duplicate entry');
          data_err={email_err:'E-mail Already exist'};
          if(req.body.dob){
            res.render('registersitter',{data:{file: ""}, error: data_err, uname:' ',sid:'', did: '', status: ''})
          }
          else{
            res.render('registeration',{data:data_err,uname:' ',sid:'', did: '', status: ''});
          }
        }
      }
      else{
        console.log("1 record inserted, ID: " + result.insertId);
        req.files.fileUpload.mv(newpath2, function(err) {
          if(err)
            return res.status(500).send(err);
          console.log('moved');
        });
        id = result.insertId.toString();
        if(req.session.nod){
          console.log(req.session.nod);
        }
        else{
          req.session.nod = 0;
        }
        return callback(result.insertId.toString());
      }
    })
  }
  get_info(req.body, function(result){
     id = result;
     console.log('here');
     if(req.body.dob) {
       send_mail(req.body.email,bcrypt.hashSync(id, 10));
       insert_sitter.ins_dob1(id,req.body.dob,res);
     }
     else {
     //send_mail(req.body.email,bcrypt.hashSync(id, 10));
     console.log(id);
     res.redirect('/');
   }
  })
}
