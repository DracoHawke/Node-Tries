module.exports = function(req,res){
  var sql = "select a.`data` from `home` a inner join (select min(`no`) as Max FROM `home`) b ON a.`no` = b.Max";
  connection.query(sql,function(err,rows,fields){
    if (err) {console.log(err);}
    if (rows.length == 1){
      var data = rows[0].data;
      if(data == null){
        res.render("site_home",{details: req.session, uname:" ", login: req.session, sid: "", did: ""});
      }
      else{
        console.log(data.length);
        res.render("site_home",{details: req.session, data: data, uname:" ", login: req.session, sid: "", did: ""})
      }
    }
    else{
      res.render("site_home",{details: req.session});
    }
  });
}
