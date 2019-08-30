module.exports = function(req,res){
  var sql = "select a.`faq` from `admin` a inner join (select min(`no`) as Max FROM `admin`) b ON a.`no` = b.Max";
  connection.query(sql,function(err,rows,fields){
    if (err) {console.log(err);}
    if (rows.length == 1){
      var data = rows[0].faq;
      if(data == null){
        res.render("admin_faq",{details: req.session});
      }
      else{
        //console.log(data.length);
        res.render("admin_faq",{details: req.session, data: data})
      }
    }
    else{
      res.render("admin_faq",{details: req.session});
    }
  });
}
