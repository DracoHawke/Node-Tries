var Joi = require('@hapi/joi');
var mes = require('./errmes');
var mail_check = require('./email-exist');

const schema_fname = Joi.object().keys({fname: Joi.string().min(3).max(30).required()})
const schema_lname = Joi.object().keys({lname: Joi.string().min(3).max(30).required()})
const schema_phone = Joi.object().keys({phone:Joi.string().regex(/^[0-9]{10}$/).required()})
const schema_dob1 = Joi.object().keys({dob:Joi.string().regex(/([12]\d{3}-(02)-(0[1-9]|1[0-9]|2[0-9]))/).required()})
const schema_dob2 = Joi.object().keys({dob:Joi.string().regex(/([12]\d{3}-(02)-(0[1-9]|1[0-9]|2[0-8]))/).required()})
const schema_dob3 = Joi.object().keys({dob:Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).required() })
exports.fval = function(app){

var error_data={success:''};
console.log(error_data);
var f=0;

var txt ='{ "fname":"'+app.fname+'"}';
var obj = JSON.parse(txt);
var { error } =Joi.validate(obj, schema_fname);
if (error){
  error_data.fname_err=mes.message(error);
  console.log(error_data);
  f=1;
}
console.log(f);

var txt ='{ "lname":"'+app.lname+'"}';
var obj = JSON.parse(txt);
var { error } =Joi.validate(obj, schema_lname);
if (error){
  error_data.lname_err=mes.message(error);
  console.log(error_data);
  f=1;
}
console.log(f);

var txt ='{ "phone":"'+app.phone+'"}';
var obj = JSON.parse(txt);
var { error } =Joi.validate(obj, schema_phone);
if (error){
  error_data.phone_err=mes.message(error);
  f=1;
  console.log(error_data);
}
console.log(f);

var c = app.dob;
var a = c.split("-");
if(Number(a[1]) == 2){
  if(Number(a[0])%4 == 0){
    var txt ='{ "dob":"'+app.dob+'"}';
    var obj = JSON.parse(txt);
    var { error } =Joi.validate(obj, schema_dob1);
    if (error){
      error_data.dob_err=mes.message(error);
      f=1;
      console.log("dob1: ",error_data);
    }
  }else{
    var txt ='{ "dob":"'+app.dob+'"}';
    var obj = JSON.parse(txt);
    var { error } =Joi.validate(obj, schema_dob2);
    if (error){
      error_data.dob_err = mes.message(error);
      f = 1;
      console.log("dob2: ",error_data);
    }
  }
}
else{
  var txt ='{ "dob":"'+app.dob+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_dob3);
  if (error){
    error_data.dob_err=mes.message(error);
    f = 1;
    console.log("dob3: ",error_data);
  }
}

if(f!=1){
  error_data.success='yes';
  console.log(error_data);
}
return error_data;
}
