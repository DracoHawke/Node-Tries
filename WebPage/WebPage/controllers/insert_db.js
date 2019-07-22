var mysql = require('mysql');
var bcrypt = require('bcryptjs');
send_mail=require('./send_mail');

global.res='';
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dogmate"
});

con.connect(function(err) {
  if (err) throw err;
});

module.exports=function(req ,callback){
    val=req.body;
    var id='';
    function get_info(val, callback){
  const hash = bcrypt.hashSync(val.password, 10);
    var sql = "INSERT INTO `users`( `Name`, `Email`, `U_Password`, `address`, `DOB`, `Phone`, `Gender`, `Pack`,`status`) VALUES ("+mysql.escape(val.name)+","+mysql.escape(val.email)+","+mysql.escape(hash)+","+mysql.escape(val.address)+","+mysql.escape(val.dob)+","+mysql.escape(val.phone)+","+mysql.escape(val.gender)+","+mysql.escape(val.pack)+",'0')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted, ID: " + result.insertId);
        req.session.cookie.id=result.insertId.toString();
       return callback(result.insertId.toString());
    })
}
get_info(req.body, function(result){
   req.session.cookie.id = result;
   send_mail(req.body.email,bcrypt.hashSync(req.session.cookie.id, 10));
   console.log(req.session.cookie.id);
})
}
