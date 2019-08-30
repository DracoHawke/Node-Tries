var mysql = require('mysql');
var db_connect = require('./db-connect');
fileval=require('./fileval');
var fs = require('fs');
var bcrypt = require('bcryptjs');

var con=db_connect();
var f=0;

module.exports=function(req,res){
    var re=/^(?!.*(?:01|12|23|34|45|56|67|78|89|90|09|98|87|76|65|54|43|32|21|10|ab|bc|cd|de|ef|fg|gh|hi|ij|jk|kl|lm|mn|no|op|pq|qr|rs|st|tu|uv|vw|wx|xy|yz))(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{6,}$/;
    var error_data={};
    var flag=0;
    var query='';
    if(req.body.name==''){
        error_data.name_err='Name Field Cannot Be Left Empty';
        flag=1;
    }
    else{
     query='`admin`.`Name`='+mysql.escape(req.body.name);
    }
    if(req.body.password=='')
    {
        flag=0;
    }
    else if(re.test(req.body.password)==false){
        error_data.password_err='Password Does not Matches The Correct Pattern';
        flag=1;
    }
    else if(req.body.password!=req.body.confirmPass){
        error_data.confirm_err='Does not Matches the Password';
        flag=1;
    }
    else
    {
      const hash = bcrypt.hashSync(req.body.password, 10);
      query=query+',`admin`.`Password`='+mysql.escape(hash);
    }
    error_data=fileval(req.files,error_data);
    if(error_data.file_err=='Cannot Be Left Empty')
    {
      error_data.file_err='';
    }
    else if(error_data.file_err==''){
      var oldpath = req.files.fileUpload.path;
      var newpath = '/users/' +req.body.email+req.files.fileUpload.name;
      query=query+',`admin`.`Profile`='+mysql.escape(newpath);
      f=1;
      if(Object.keys(error_data).length==1){
        error_data.success='123';
      }
    }
    else {
     flag=1;
    }
    console.log(req.body);
      var sql='UPDATE admin SET '+query+' where `admin`.`Email`="'+req.session.admin_email+'"';
    console.log(sql);
    console.log(error_data);
    console.log(flag);
    
    //error_data.success='';
    //var f=0;
    if(flag==0){
      con.query(sql, function (err, result) {
        if(err) throw err;
        console.log('successfuly updated');
        if(f==1)
        {
            req.session.admin_profile=newpath;
            req.session.admin_name=req.body.name;
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
        res.redirect('/admin_profile');
      });
    }
    else {
        req.body.Name=req.body.name;
        req.body.Email=req.body.email;
        req.body.Profile=req.body.img;
      res.render('admin_profile',{details:req.session,admin_info:req.body,error:error_data});
    }
    //res.end();
};
