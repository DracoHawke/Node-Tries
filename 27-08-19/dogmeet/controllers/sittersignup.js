var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(res,req){
  var name={uname:'',lname:'',email:'',phone:'',status_err:'',read:'',dob:'',fname:'',file:''};
  if(req.session.uname) {
      console.log(req.session);
      if(req.session.sid==1) {
        var sid=req.session.sid;
        res.redirect('/');
      }
      else {
        var sid='';
      var uname=req.session.uname;
    console.log('here');
    var email=req.session.email;
    connection.query('SELECT * from users where Email = "' + email +'"', function(err, rows, fields) {
      if(!err){
        console.log('here');
        if(rows.length==1 && rows[0].status==1){

        //  name.uname=rows[0].Fname;
        var uname=name.fname=req.session.uname;
          name.lname=rows[0].Lname;
          name.email=rows[0].Email;
          name.phone=rows[0].Phone;
          name.file=rows[0].Profile;
          name.read='readonly';
          console.log(name);
          console.log(sid);
          res.render('registersitter',{data:name,error:{},uname:uname,sid:sid,login:req.session});
        }
        else {
          name.status_err='not ver';
          var uname=req.session.uname;
          res.render('registersitter',{data:name,error:{},uname:uname,sid:sid,login:req.session});
        }
      }
      else {
        console.log("There's an error in the query");
      }
    })
  }
  }
  else {
    res.render('registersitter',{data:name,error:{},uname:'',sid:''});
  }
};
