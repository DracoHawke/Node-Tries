var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res,error1){
  var sid = 0;
  var did = 0;
  var error = "";
  if(Object.keys(error1).length != 0){
    for (i in error1){
      if(i == "success"){
        continue;
      }
      i1 = i.replace(/_/g, ' ');
      error = error + i1 + ": " + error1[i] + ",";
    }
  }
  if(req.session.sid){sid = 1;}
  if(req.session.did){did = 1;}
  var dno = req.query.dno;
  console.log(sid);
  if(req.session.uname){
    if(req.session.status == 0){
      console.log(sid);
      res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:error,page: "",login:req.session});
    }
    else{
      var sql = "SELECT `dogs`.`DogGender`,`dogs`.`Description`,`dogs`.`Did`,`dogs`.`DogName`,`dogs`.`DogAge`,`dogs`.`DogBreed`,`dogs`.`DogPic1`,`dogs`.`DogPic2`,`dogs`.`DogPic3`,`dogs`.`DogPic4`,`dogs`.`DogPic5`, `dogs`.`enabled` FROM `users` LEFT JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `users`.`Email`="+mysql.escape(req.session.email)+" and `dogs`.`did` = "+req.query.did;
      con.query(sql, function (err, rows, fields) {
        console.log(sql);
        if (err) throw err;
        var send_data={};
        var row = {};
        var l = rows.length;
        if(l == 1){
          row = rows;
        }
        else{
          res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:error, page: "",login:req.session});
        }
        console.log(l);
        console.log(req.session.email);
        //console.log(row[0]);
        console.log(row);
        send_data = row;
        send_data.status_err='verified';
        //console.log(send_data.Did);
        req.session.currdog = req.query.did;
        if(send_data[0].Did != null)
          res.render('dashboard',{uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error, page:"dogdetails", dogdid: req.query.did, dno: dno,login:req.session});
        else{
          console.log("no did", error);
          res.render('dashboard',{uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error, page: "dogdetails", dogdid: req.query.did, dno: dno,login:req.session});
        }
      });
    }
  }
  else
    res.redirect('/');
}
