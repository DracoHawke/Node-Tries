var Joi = require('@hapi/joi');
var mes=require('./errmes');
var formvalidator=require('./formvalidator');
var insert_sitter=require('./insert_sitter');

var f=0;
var data_err={};
module.exports=function(req,res){
  console.log('here');
  if(req.session.uname){
    var data_err={};
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
        var data=req.body;
        console.log(req.body);
      res.render('registersitter',{data:req.body,error:data_err,uname:req.session.uname,sid:sid,login:req.session});
    }
    else {
      insert_sitter.insertsitter(req,res);
    //  res.end();
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
      data.file=req.files.fileUpload.path;
      console.log(data.file);
      res.render('registersitter',{data:data,error:data_err,uname:'',sid:''});
    }
    else {
      insert_sitter.insertsitter(req,res);
      console.log(req.files);
      //res.end();
    }
  }
};
