var mysql = require('mysql');
var pool = mysql.createConnection({
  connectionLimit : 100,
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'dogmate'
});
//connection.connect();
exports.fval=function(apps){
  console.log(apps);
  var a = check(apps);
  return a;
  console.log('end');
}
function check(apps){
  pool.query('SELECT users.Name,users.status,users.U_password from users where users.Email = "' + apps.u_email +'"', function(err, rows, fields) {
    console.log("i'm in");
    console.log(rows.length);
    if(rows.length > 0){
      if(apps.logedin == '1'){
        if(apps.u_pass == row[0].U_password){
          return "successful1";
        }
        else{
          return "wrong pass";
        }
      }
      else{
        console.log('hacker');
      }
    }
    else if(rows.length == 0){
      console.log('newest');
      let insertQuery = 'INSERT INTO ??(?,?,?) VALUES (?,?,?)';
      let query = mysql.format(insertQuery,["users",'Name','Email','U_password',apps.u_name,apps.u_email,apps.u_pass]);
      pool.query(query,(err, response) => {
          if(err) {
              console.error(err);
              return;
          }
          console.log();
          return "successful";
      });
    }
  });
}
