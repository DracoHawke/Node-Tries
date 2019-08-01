var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res,error1){
  var sid = 0;
  var did = 0;
  if(req.session.sid){sid = 1;}
  if(req.session.did){did = 1;}
  console.log(sid);
  if(req.session.uname){
    if(req.session.status == 0){
      console.log(sid);
      res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:{}});
    }
    else{
      var sql = "SELECT `dogs`.`DogName`,`dogs`.`DogAge`,`dogs`.`DogBreed`,`dogs`.`Rating`,`dogs`.`Reviews`,`dogs`.`DogPic1`,`dogs`.`DogPic2`,`dogs`.`DogPic3`,`dogs`.`DogPic4`,`dogs`.`DogPic5` FROM `users` LEFT JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `users`.`Email`="+mysql.escape(req.session.email);
      con.query(sql, function (err, rows, fields) {
        console.log(sql);
        if (err) throw err;
        var send_data={};
        var row = {};
        var l = rows.length;
        if(l > 0){
          row = rows;
        }
        console.log(l);
        console.log(req.session.email);
        for(var i = 0; i < l; i++){
          var b = row[i];
          //console.log(b);
          if(b.DogPic1 != null) {
            b.DogPicFront = b.DogPic1;
          }
          else if(b.DogPic2 != null) {
            b.DogPicFront = b.DogPic2;
          }
          else if(b.DogPic3 != null) {
            b.DogPicFront = b.DogPic3;
          }
          else if(b.DogPic4 != null) {
            b.DogPicFront = b.DogPic4;
          }
          else if(b.DogPic5 != null) {
            b.DogPicFront = b.DogPic5;
          }
          else {
            b.DogPicFront = 'users/default.png';
          }
          //console.log(b);
          delete b.DogPic1;
          delete b.DogPic2;
          delete b.DogPic3;
          delete b.DogPic4;
          delete b.DogPic5;
          //console.log(b);
          //b = b.filter(function () { return true });
          console.log(b);
          row[i] = b;
        }
        //console.log(row[0]);
        //console.log(row);
        send_data = row;
        send_data.status_err='verified';
        console.log(send_data);
        if(send_data.Did != null)
          res.render('mydogs',{uname:req.session.uname,sid:sid,did:did,send_data:send_data,error:error1});
        else
          res.render('mydogs',{uname:req.session.uname,sid:sid,did:did,send_data:send_data,error:error1});
      });
    }
  }
  //else
    //res.redirect('/');
}
