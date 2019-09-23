mysql = require('mysql');
db_connect = require('./db-connect');
bcrypt = require('bcryptjs');

connection = db_connect();

module.exports = function(req,res){
  console.log(req.body);
  if(typeof req.body.password !== "undefined") {
    var password = req.body.password;
    sql = 'SELECT users.Uid,users.U_password,users.Fname,users.status,users.Profile,`users`.`No_of_Dogs` from users where users.Email = "' + req.session.email + '"';
    connection.query(sql,function(err,rows1){
      if (err) throw err;
      console.log(rows1);
      if(rows1.length == 1 && bcrypt.compareSync(password, rows1[0].U_password.toString()) && rows1[0].No_of_Dogs > 0){
        console.log("true");
        var sql2 = "UPDATE `users` SET `users`.`No_of_Dogs` = (`users`.`No_of_Dogs` - 1) WHERE `users`.`email` = '"+req.session.email+"' and `users`.`No_of_Dogs` > 0";
        console.log(sql2);
        connection.query(sql2,function(err,results){
          if(err) throw err;
          var sql3 = "DELETE FROM `dogs` WHERE `dogs`.`did` = "+req.session.currdog;
          console.log(sql3);
          connection.query(sql3,function(err,results){
            if(err) throw err;
            console.log(rows1[0].No_of_Dogs - 1);
            if(rows1[0].No_of_Dogs-1 > 0){
              console.log("Not Last Dog");
              res.redirect('/dashboard/mydogs');
            }
            else if(rows1[0].No_of_Dogs - 1 <= 0){
              delete req.session.did;
              delete req.session.currdog;
              delete req.session.currdno;
              console.log("Last Dog");
              console.log(req.session.currdno);
              console.log(req.session.currdog);
              console.log(login);
              console.log(req.session);
              res.redirect('/dashboard');
            }
          })
        })
      }
      else if(!(bcrypt.compareSync(password, rows1[0].U_password.toString()))){
        query1 = "?did="+req.session.currdog+"&dno="+req.session.currdno;
        console.log(req.session);
        error1 = {};
        error1.deldog = "Wrong Password";
        error1 = JSON.stringify(error1);
        res.redirect("/dogdetails/"+error1+query1);
      }
      else if(rows1[0].No_of_Dogs <= 0){
        req.session.did = 0;
        res.redirect("/");
      }
    })
  }
}
