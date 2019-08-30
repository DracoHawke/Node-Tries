var nodemailer = require('nodemailer');
var mysql = require('mysql');
var db_connect = require("./db-connect");
var con = db_connect();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false, // use SSL
       port: 25,
  auth: {
    user: 'sgtechqa@gmail.com',
    pass: 'sgtech@1234'
  }
});

module.exports = function(mail,res) {
  console.log(mail);
  var sql = "select `subscribers`.`Email` from `subscribers`";
  con.query(sql,function(err, rows, fields) {
    if(err){console.error(err);}
      if(rows.length > 0) {
        var maillist = [];
        for(i = 0; i < rows.length; i++) {
          maillist.push(rows[i].Email);
          console.log(rows[i].Email);
        }
        console.log(maillist);
        maillist.forEach(function (to, i , array) {
          console.log(to,i,array);
          var mailOptions = {
            from: 'sgtechqa@gmail.com',
            subject: 'Newsteller',
            html: '<h1>Welcome</h1><p>Here is our newest News</p><p>'+mail.news+'</p>'
          }
          mailOptions.to = to;
          console.log(mailOptions);
          var flag = 1;
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              flag = 0;
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        });
        res.redirect("back");
      }
    console.log(rows);
  });
};
