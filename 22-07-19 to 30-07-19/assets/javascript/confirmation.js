var bcrypt = require('bcryptjs');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dogmate"
});

module.exports=function(req,res){
  hash=req.query.id;
  mail=req.query.check;
  con.connect(function(err) {
    if (err) throw err;
    var sql = 'SELECT Uid FROM `users` WHERE Email = ' + mysql.escape(mail);
    con.query(sql, function (err, result) {
      console.log(hash);
      if (err) throw err;
      if(bcrypt.compareSync(result[0].Uid.toString(), hash)) {
        var sql = 'UPDATE `users` SET `status`=1 WHERE Email = ' + mysql.escape(mail);
        con.query(sql, function (err, result) {
          if (err) throw err;
        //  res.redirect('/');
        });
        //console.log(status);
         var data={id:'1'};
         res.render('verify',{data:data,uname:'',sid:''});
      } else {
       // Passwords don't match
       res.redirect('/');
      }
    });
  });
}
