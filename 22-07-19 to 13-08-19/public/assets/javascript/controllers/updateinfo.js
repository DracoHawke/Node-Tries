formvalidatorpass = require('./formvalidatorpass');
formvalidatornopass = require('./formvalidatornopass');
fileval = require('./fileval');
insert_db_nofile = require("./insert_db_nofile");
insert_db_file = require("./insert_db_file");
insert_db_passnofile = require("./insert_db_passnofile");
insert_db_passfile = require("./insert_db_passfile");
dashboard = require('./dashboard');

module.exports = function(req,res,check){
  if(req.session.uname){
    var uname = req.session.uname;
    if(req.session.sid){var sid = req.session.sid;}else{var sid = "";}
    if(req.session.did){var did = req.session.did;}else{var did = "";}
    if(check == "nopass") {
      console.log("nopass");
      var data_err = formvalidatornopass.fval(req.body);
      if(Object.keys(req.files).length == 1){
        var c = Object.keys(req.files);
        var d = req.files;
        var e = d[c[0]];
        if(e.name == "" && e.mimetype == 'application/octet-stream'){
          console.log("no file uploaded");
          if(data_err.success == ""){
            res.render("dashboard",{uname: uname, sid: sid, did: did, send_data: req.body, error: data_err, check: "myacc", login: req.session});
          }
          else{
            insert_db_nofile(req,res);
          }
        }
        else if(e.name != "" && e.mimetype != 'application/octet-stream'){
          if(e.size> 40000000){
            data_err.file_err='File Size Must Be Less Than 40MB'; // set err feild for file.
            data_err.success = "";
          }
          if(!(e.mimetype == 'image/png' || e.mimetype == 'image/jpg' || e.mimetype == 'image/jpeg') ){
            data_err.success = "";
            data_err.file_err = "Please select valid format files"; // set err feild for file.
          }
        }
        else{
          data_err.success = "";
          data_err.file_err = "Please select valid format files"; // set err feild for file.
        }
        if(data_err.success == ""){
          res.render("dashboard",{uname: uname, sid: sid, did: did, send_data: req.body, error: data_err, check: "myacc", login: req.session});
        }
        else{
          insert_db_file(req,res);
        }
      }
      else{
        data_err.file_err = "single file only";
      }
    }
    else if(check == "passpresent"){
      console.log("passpresent");
      var data_err = formvalidatorpass.fval(req.body);
      if(Object.keys(req.files).length == 1){
        var c = Object.keys(req.files);
        var d = req.files;
        var e = d[c[0]];
        if(e.name == "" && e.mimetype == 'application/octet-stream'){
          console.log("no file uploaded, err1: ", data_err);
          if(data_err.success == ""){
            console.log("render");
            //res.render("dashboard",{uname: uname, sid: sid, did: did, send_data: req.body, error: data_err, check: "myacc", login: req.session});
          }
          else{
            console.log("enter?");
            insert_db_passnofile(req,res);
          }
        }
        else if(e.name != "" && e.mimetype != 'application/octet-stream'){
          if(e.size> 40000000){
            data_err.file_err='File Size Must Be Less Than 40MB'; // set err feild for file.
            data_err.success = "";
          }
          if(!(e.mimetype == 'image/png' || e.mimetype == 'image/jpg' || e.mimetype == 'image/jpeg') ){
            data_err.success = "";
            data_err.file_err = "Please select valid format files"; // set err feild for file.
          }
        }
        else{
          data_err.success = "";
          data_err.file_err = "Please select valid format files"; // set err feild for file.
        }
        if(data_err.success == ""){
          data_err = JSON.stringify(data_err);
          //res.render("dashboard",{uname: uname, sid: sid, did: did, send_data: req.body, error: data_err, check: "myacc", login: req.session});
          res.redirect("/dashboard/myacc?d="+data_err);
        }
        else{
          insert_db_passfile(req,res);
        }
      }
    }
    else{
      res.redirect("/logout");
    }
  }
}
