mysql = require('mysql');
db_connect = require('./db-connect');

connection = db_connect();

module.exports = function(req,res){
  console.log(req.query);
  if(typeof req.session.currdog !== "undefined" && typeof req.session.currdno !== "undefined") {
    console.log("currdog: ", req.session.currdog, " currdno: ", req.session.currdno);
    if((Number(req.session.currdog) == Number(req.query.did) && Number(req.session.currdno) != Number(req.query.dno)) || (Number(req.session.currdog) != Number(req.query.did) && Number(req.session.currdno) == Number(req.query.dno))) {
        res.send("No");
        console.log(1);
    }
    else if(Number(req.session.currdog) != Number(req.query.did) && Number(req.session.currdno) != Number(req.query.dno)){
        res.send("No");
        console.log(2)
    }
    else if(Number(req.session.currdog) == Number(req.query.did) && Number(req.session.currdno) == Number(req.query.dno)){
        res.send("Yes");
        console.log(3);
    }
  }
}
