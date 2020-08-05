mysql = require('mysql');
db_connect = require('./db-connect')

connection = db_connect();

module.exports = function(req,res,error1) {
  console.log("query: ", req.query);
  var error = {};
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
  console.log("dno: ", dno);
  if(req.session.uname) {
    if(req.session.status == 0) {
      console.log("status = 0");
      res.redirect('/');
    }
    else {
      var sql = "SELECT `dogs`.`Did`,`dogs`.`enabled` FROM `users` LEFT JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `users`.`Email`="+mysql.escape(req.session.email);
      connection.query(sql, function (err, rows1, fields) {
        if(rows1.length == 0) {
            res.redirect('registerdog');
        }
        else {
          var sql2 = "SELECT `dogs`.`Did`,`dogs`.`enabled` FROM `users` LEFT JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `users`.`Email`="+mysql.escape(req.session.email)+" and `dogs`.`did` = "+req.query.did;
          connection.query(sql2, function (err, rows, fields) {
            console.log(sql);
            if (err) throw err;
            var send_data = {};
            var row = {};
            var l = rows.length;
            if(l == 1) {
              var dno1 = -1;
              for(i = 0; i < rows1.length; i++){
                  if(rows[0].Did == rows1[i].Did){
                      dno1 = i;
                      break;
                  }
              }
              console.log("dno1: ",dno);
              if(dno1 == -1) {
                  res.render("notfound");
              }
              else {
                if(req.query.dno != dno1){
                    res.redirect("dogdetails?did="+req.query.did+"&dno="+dno1);
                }
                else {
                  req.query.dno = dno1;
                  console.log("changed query log: ", req.query.dno);
                  row = rows;
                  console.log(req.session.email);
                  send_data = row;
                  send_data.status_err = 'verified';
                  if(typeof req.session.currdog !== "undefined" && typeof req.session.currdno !== "undefined") {
                    console.log("currdog: ", req.session.currdog, " currdno: ", req.session.currdno);
                    if((req.session.currdog == req.query.did && req.session.currdno != req.query.dno) || (req.session.currdog != req.query.did && req.session.currdno == req.query.dno)){
                        res.render("notfound");
                    }
                    else if(req.session.currdog != req.query.did && req.session.currdno != req.query.dno){
                      req.session.currdog = req.query.did;
                      req.session.currdno = req.query.dno;
                      if(send_data[0].Did != null){
                        console.log("first?");
                        if(send_data[0].enabled == 0){
                          var sql3 = "UPDATE `dogs` SET `dogs`.`enabled` = 1 WHERE `dogs`.`Did` = "+req.query.did;
                          console.log("first sql3: ", sql3);
                          res.redirect('/dashboard/mydogs');
                        }
                        else if(send_data[0].enabled == 1){
                          var sql3 = "UPDATE `dogs` SET `dogs`.`enabled` = 0 WHERE `dogs`.`Did` = "+req.query.did;
                          console.log("second sql3: ", sql3);
                          res.redirect('/dashboard/mydogs');
                        }
                        else {
                          var sql3 = "UPDATE `dogs` SET `dogs`.`enabled` = 1 WHERE `dogs`.`Did` = "+req.query.did;
                          console.log("third sql3: ", sql3);
                          res.redirect('/dashboard/mydogs');
                        }
                        connection.query(sql3,function(err,result) {
                          if(err) throw err;
                          console.log('successfuly updated');
                        })
                        //res.render('dashboard',{uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error, page:"dogdetails", dogdid: req.query.did, dno: dno,login:req.session});
                      }
                      else {
                        console.log("no did", error);
                        res.render('notfound',{uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error, page: "dogdetails", dogdid: req.query.did, dno: dno,login:req.session});
                      }
                    }
                    else {
                      if(send_data[0].Did != null){
                        console.log("second?");
                        if(send_data[0].enabled == 0){
                          var sql3 = "UPDATE `dogs` SET `dogs`.`enabled` = 1 WHERE `dogs`.`Did` = "+req.query.did;
                          console.log("first sql3: ", sql3);
                          res.redirect('/dashboard/mydogs');
                        }
                        else if(send_data[0].enabled == 1){
                          var sql3 = "UPDATE `dogs` SET `dogs`.`enabled` = 0 WHERE `dogs`.`Did` = "+req.query.did;
                          console.log("second sql3: ", sql3);
                          res.redirect('/dashboard/mydogs');
                        }
                        else {
                          var sql3 = "UPDATE `dogs` SET `dogs`.`enabled` = 1 WHERE `dogs`.`Did` = "+req.query.did;
                          console.log("third sql3: ", sql3);
                          res.redirect('/dashboard/mydogs');
                        }
                        connection.query(sql3,function(err,result){
                          if(err) throw err;
                          console.log('successfuly updated');
                        })
                        //res.render('dashboard',{uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error, page:"dogdetails", dogdid: req.query.did, dno: dno,login:req.session});
                      }
                      else {
                            console.log("no did", error);
                            res.render('notfound',{uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error, page: "dogdetails", dogdid: req.query.did, dno: dno,login:req.session});
                        }
                    }
                  }
                  else {
                    req.session.currdog = req.query.did;
                    req.session.currdno = req.query.dno;
                    console.log(req.session.currdno);
                    if(send_data[0].Did != null){
                      console.log("third?");
                      if(send_data[0].enabled == 0){
                        var sql3 = "UPDATE `dogs` SET `dogs`.`enabled` = 1 WHERE `dogs`.`Did` = "+req.query.did;
                        console.log("first sql3: ", sql3);
                        res.redirect('/dashboard/mydogs');
                      }
                      else if(send_data[0].enabled == 1){
                        var sql3 = "UPDATE `dogs` SET `dogs`.`enabled` = 0 WHERE `dogs`.`Did` = "+req.query.did;
                        console.log("second sql3: ", sql3);
                        res.redirect('/dashboard/mydogs');
                      }
                      else {
                        var sql3 = "UPDATE `dogs` SET `dogs`.`enabled` = 1 WHERE `dogs`.`Did` = "+req.query.did;
                        console.log("third sql3: ", sql3);
                        res.redirect('/dashboard/mydogs');
                      }
                      connection.query(sql3,function(err,result){
                        if(err) throw err;
                        console.log('successfuly updated');
                      })
                      //res.render('dashboard',{uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error, page:"dogdetails", dogdid: req.query.did, dno: dno,login:req.session});
                    }
                    else {
                      console.log("no did", error);
                      res.render('notfound',{uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error, page: "dogdetails", dogdid: req.query.did, dno: dno,login:req.session});
                    }
                  }
                }
              }
            }
            else if(l == 0) {
                res.render('notfound');
            }
            else {
              res.render('notfound',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:error, page: "",login:req.session});
            }
          });
        }
      });
    }
  }
  else
    res.redirect('/');
}