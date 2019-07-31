var Joi = require('@hapi/joi');
var mes=require('./derrmes');

const schema_fname = Joi.object().keys({u_fname: Joi.string().min(3).max(30).required()})
const schema_lname = Joi.object().keys({u_lname: Joi.string().min(3).max(30)})
const schema_password = Joi.object().keys({u_pass: Joi.string().regex(/^(\d{3,4})$|^(?!.*(?:01|12|23|34|45|56|67|78|89|90|09|98|87|76|65|54|43|32|21|10))(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@!.$%]{6,}$/).required(),u_cpass:Joi.any().valid(Joi.ref('u_pass')).required()})
const schema_email = Joi.object().keys({u_email: Joi.string().email().required()})
const schema_zip = Joi.object().keys({u_zip:Joi.number().positive().required()})
const schema_address = Joi.object().keys({u_address:Joi.string().allow('').optional()})
const schema_phone = Joi.object().keys({u_phone:Joi.string().regex(/^(\d{10})$/).required() })

exports.fval=function(app){
  //var error_data={name_err:'', password_err:'', email_err:'', dob_err:'', confirm_err:'', address_err:'', gender_err:'', phone_err:'', pack_err:''}
var error_data={success:''};
var f=0;
  var txt ='{ "u_fname":"'+app.u_fname+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_name);
  if (error){
    error_data['u_fname_err']="name "+mes.message(error);
    f=1;
  }

  var txt ='{ "u_lname":"'+app.u_lname+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_name);
  if (error){
    error_data['u_lname_err']="name "+mes.message(error);
    f=1;
  }

  var txt ='{ "u_email":"'+app.u_email+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_email);
  if (error){
    error_data.email_err="email "+mes.message(error);
    f=1;
  }

  var txt ='{ "u_pass":"'+app.u_pass+'","u_cpass":"'+app.u_cpass+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_password);
  if (error){
    error_data.u_pass_err="pass "+mes.message(error);
    f=1;
  }

  var txt ='{ "u_address":"'+app.u_address+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_address);
  if (error){
    error_data.u_address_err="add "+mes.message(error);
    f=1;
  }

  var txt ='{ "u_zip":"'+app.u_zip+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_zip);
  if (error){
    error_data.u_zip_err="zip "+mes.message(error);
    f=1;
  }

  var txt ='{ "u_phone":"'+app.u_phone+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_phone);
  if (error){
    error_data.u_phone_err="phone "+mes.message(error);
    f=1;
  }
  if(f==0)
    error_data.success='Yes';
  return error_data;
}
