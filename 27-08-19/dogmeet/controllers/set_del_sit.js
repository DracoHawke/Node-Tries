module.exports = function(req,res){
  console.log("in set sitter delete flag");
  if(req.session.uname){
    if(req.session.sid){
      req.session.dels = 1;
      res.send("Yes");
    }
    else {
      delete req.session.dels;
      res.send("Nope1");
    }
  }
  else{
    delete req.session.dels;
    res.send("Nope2");
  }
}
