module.exports = function(req,res){
  res.render("admin_about",{details: req.session});
}
