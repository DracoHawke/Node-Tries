var nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false, // use SSL
       port: 25,
  auth: {
    user: 'sgtechqa@gmail.com',
    pass: 'sgtech@1234'
  }
});

module.exports=function(mail,hash){
  console.log(mail);
  var mailOptions = {
  from: 'pankajphptraining@gmail.com',
  to: mail,
  subject: 'verification for web site',
  html: '<h1>Welcome</h1><a href=http://orientaloutsourcing.com:12000/verify?check='+mail+'&id='+hash+'>Click Here To Verify Your Account!</a>'
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
