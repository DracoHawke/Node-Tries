var db_connect = require('./db-connect');
var mysql = require('mysql');

connection=db_connect();

module.exports=function(req,res){
  if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    var sql='SELECT `users`.*,`messages`.`created_at`,`messages`.`read` FROM `messages` INNER JOIN `users` on `messages`.`Email`=`users`.`Email` WHERE messages.toEmail='+mysql.escape(req.session.email)+' UNION SELECT `users`.*,`messages`.`toEmail`,`messages`.`Email` FROM `messages` INNER JOIN `users` on `messages`.`toEmail`=`users`.`Email` where messages.Email='+mysql.escape(req.session.email);
    console.log(sql);
    connection.query(sql, function(err, rows, fields) {
      if(err) throw err;
      var email_arr=[];
      var ChatList=[];
      console.log(sql);
      //console.log(rows);
      for(var i=0;i<rows.length;i++)
      {
        var unread=0;
        if(email_arr.indexOf(rows[i].Email)==-1){
        for(var j=0;j<rows.length;j++)
        {
          if(rows[i].Email==rows[j].Email && rows[j].read==0){
            unread=unread+1;
          }
        }
          rows[i].unread=unread;
          ChatList.push(rows[i]);
          email_arr.push(rows[i].Email);
        }
      }
      console.log(ChatList);
      var page='chat';
      if(req.session.email_status==0){
        console.log(sid);
        res.render('dashboard',{uname:req.session.uname,sid:sid,send_data:{status_err:'not ver',file:''},error:{}});
      }
      else{
        console.log(req.query);
        if(req.query.to){
          if(req.query.to!=req.session.email){
            var sql='SELECT `Email`, `toEmail`, `msg`, `created_at`, `read` FROM `messages` WHERE ( Email='+mysql.escape(req.query.to)+' and toEmail='+mysql.escape(req.session.email)+') or ( Email='+mysql.escape(req.session.email)+' and toEmail='+mysql.escape(req.query.to)+') ORDER BY `messages`.`created_at` ASC'
            connection.query(sql, function(err, rows, fields) {
              if(err) throw err;
              var all_mess=rows;
              var sql='UPDATE `messages` SET `read`=1 WHERE toEmail='+mysql.escape(req.session.email)+' and Email='+mysql.escape(req.query.to);
                connection.query(sql, function (err, rows, fields) {
                if(err) throw err;
                for(var k=0;k<ChatList.length;k++){
                  if(ChatList[k].Email==req.query.to){
                    ChatList[k].unread=0;
                    break;
                  }
                }
                var sql='select `Fname`,`Lname`,`Profile` from `users` WHERE Email='+mysql.escape(req.query.to);
                connection.query(sql, function (err, rows, fields) {
                  if(err) throw err;
                  var to_det=rows;
                  res.render('dashboard',{ChatList:ChatList,login:req.session,uname:uname,send_data:'',sid:sid,page:page,to:req.query.to,all_mess:all_mess,to_det:to_det});
                });
              });
          });
        }
        else {
          res.redirect('/dashboard/chat');
        }
        }
        else
          res.render('dashboard',{ChatList:ChatList,login:req.session,uname:uname,send_data:'',sid:sid,page:page,to:''});
      }

    });
  }
  else{
    res.redirect('/');
  }
}
