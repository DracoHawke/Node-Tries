var Joi = require('@hapi/joi');
var mes=require('./errmes');
var formvalidator=require('./formvalidator');
var insert_sitter=require('./insert_sitter');

var f=0;
var data_err={};
module.exports=function(req,res){
  if(req.session.uname){
    console.log(req.body.dob);
    const schema_dob = Joi.object().keys({dob:Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).required() })
    var txt ='{ "dob":"'+req.body.dob+'"}';
    var obj = JSON.parse(txt);
    var { error } =Joi.validate(obj, schema_dob);
    if (error){
      data_err.dob_err=mes.message(error);
      req.body.read='readonly';
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      if(req.session.did)
        var did = req.session.did;
      else {
        var did = "";
      }
      res.render('registersitter',{data:req.body,error:data_err,uname:req.session.uname,sid:sid, did: did, status: req.session.status});
    }
    else {
      insert_sitter.insertsitter(req,res);
    }
  }
  else{
    var data_err=formvalidator.fval(req.body);
    req.body.uname='';
    const schema_dob = Joi.object().keys({dob:Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).required() })
    var txt ='{ "dob":"'+req.body.dob+'"}';
    var obj = JSON.parse(txt);
    var { error } =Joi.validate(obj, schema_dob);
    if (error){
      data_err.dob_err=mes.message(error);
      req.body.read='readonly';
      data_err.success='';
    }
    req.body.read='';
    console.log(data_err);
    if(data_err.success== '')
    {
      console.log(req.files);
      data=req.body;
      if(req.files.fileUpload.path){
        data.file=req.files.fileUpload.path;
      }
      else {
        data.file="";
      }
      console.log(req.files.fileUpload.path);
      res.render('registersitter',{data:req.body,error:data_err,uname:'',sid:'', did: ''});
    }
    else {
      insert_sitter.insertsitter(req,res);
      console.log(req.files);
      //res.end();
    }
  }
};
