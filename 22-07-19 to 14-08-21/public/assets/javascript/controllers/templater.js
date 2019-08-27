const fs = require('fs')

module.exports = function(req,res){
  fs.readFile('./public/assets/templating/temp1.html','utf8', function(err, data) {
     if (err) throw err;
     else{
       console.log(data);
       res.render("templates",{details: req.session, data: data});
     }
  })
}
