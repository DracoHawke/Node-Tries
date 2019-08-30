formvalidator=require('./formvalidator');
fileval=require('./fileval');
var mysql = require('mysql');
var Joi = require('@hapi/joi');
var mes=require('./errmes');
var db_connect = require('./db-connect');
var fs = require('fs');
var bcrypt = require('bcryptjs');
dashboard=require('./dashboard');

var con=db_connect();
var f=0;

module.exports=function(req,res){
  var sid='';
  if(req.session.uname)
  {
    var error_data=formvalidator.fval(req.body);
    console.log(error_data);
    var query='`users`.`Fname`='+mysql.escape(req.body.fname)+',`users`.`Lname`='+mysql.escape(req.body.lname)+',`users`.`Phone`='+mysql.escape(req.body.phone);
  //  var sql='UPDATE table_name SET field1 = new-value1, field2 = new-value2 [WHERE Clause]'
    if(error_data.password_err=='"password" is not allowed to be empty')
    {
        error_data.password_err='';
        if(Object.keys(error_data).length==2){
          error_data.success='123';
        }
    }
    else if(!error_data.password_err)
    {
      const hash = bcrypt.hashSync(req.body.password, 10);
      query=query+',`users`.`U_Password`='+mysql.escape(hash);

    }
    error_data=fileval(req.files,error_data);
    if(error_data.file_err=='Cannot Be Left Empty')
    {
      error_data.file_err='';
    }
    else if(error_data.file_err==''){
      var oldpath = req.files.fileUpload.path;
      var newpath = '/users/' +req.body.email+req.files.fileUpload.name;
      query=query+',`users`.`Profile`='+mysql.escape(newpath);
      f=1;
      if(Object.keys(error_data).length==1){
        error_data.success='123';
      }
    }
    else {
      error_data.success='';
    }
    if(req.session.sid)
    {
      sid=1;
      const schema_dob = Joi.object().keys({dob:Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).required() })
      var txt ='{ "dob":"'+req.body.dob+'"}';
      var obj = JSON.parse(txt);
      var { error } =Joi.validate(obj, schema_dob);
      if (error){
        error_data.dob_err=mes.message(error);}
      else
        error_data.dob_err='';
      if(error_data.dob_err!='')
        error_data.success='';
      query=query+',`sitters`.`dob`='+mysql.escape(req.body.dob)+',`sitters`.`Description`='+mysql.escape(req.body.aboutme);
      var sql='UPDATE `users`,`sitters` SET '+query+' where `sitters`.`Uid`=`users`.`Uid` and `users`.`Email`="'+req.session.email+'"';
    }
    else {
      var sql='UPDATE users SET '+query+' where `users`.`Email`="'+req.session.email+'"';
    }
    console.log(sql);
    console.log(error_data);
    console.log('hanji');
    //error_data.success='';
    //var f=0;
    if(error_data.success!=''){
      con.query(sql, function (err, result) {
        if(err) throw err;
        console.log('successfuly updated');
        if(f==1)
        {
          newpath='public'+newpath;
          fs.readFile(oldpath, function (err, data) {
            if (err) throw err;
              console.log('File read!');

            // Write the file
            fs.writeFile(newpath, data, function (err) {
              if (err) throw err;
              console.log('File written!');
            });
          });
        }
        res.redirect('/dashboard');
      });
    }
    else {
      dashboard(req,res,error_data);
    }
  }
  else {
    res.send('session time out');
  }
};
