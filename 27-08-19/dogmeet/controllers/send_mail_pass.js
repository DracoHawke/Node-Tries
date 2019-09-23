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

module.exports = function(mail,hash) {
  console.log(mail);
  var b = '<h1>Welcome</h1><br><p>You Have requested a change in your password for your account.</p>'+
  '<p>If you are not registered with our site or have not requested for a password change, please ignore the link below.</p>'+
  '<a href = http://localhost:49159/recoverpass?check='+mail+'&id='+hash+'>Click Here To Change Your Account Password!</a><br>'+
  '<br><p>Regards,</p><p>dogmate team</p>';
  var mailOptions = {
  from: 'pankajphptraining@gmail.com',
  to: mail,
  subject: 'verification for dogmate Account',
  html: b
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);    }
  });
};
