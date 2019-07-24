var Joi = require('@hapi/joi');
var mes=require('./errmes');

const schema_name = Joi.object().keys({name: Joi.string().min(3).max(30).required()})
const schema_password = Joi.object().keys({password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),confirmPass:Joi.any().valid(Joi.ref('password')).required()})
const schema_email = Joi.object().keys({email: Joi.string().email().required() })
const schema_dob = Joi.object().keys({dob:Joi.date().required() })
const schema_address = Joi.object().keys({address:Joi.string().allow('').optional() })
const schema_gender = Joi.object().keys({gender:Joi.required() })
const schema_phone = Joi.object().keys({phone:Joi.string().regex(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/).required() })

exports.fval=function(app){
  //var error_data={name_err:'', password_err:'', email_err:'', dob_err:'', confirm_err:'', address_err:'', gender_err:'', phone_err:'', pack_err:''}
var error_data={success:''};
var f=0;
  var txt ='{ "name":"'+app.name+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_name);
  if (error){
    error_data.name_err=mes.message(error);
    f=1;
  }

  var txt ='{ "email":"'+app.email+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_email);
  if (error){
  error_data.email_err=mes.message(error);
  f=1;
  }

  var txt ='{ "password":"'+app.password+'","confirmPass":"'+app.confirmPass+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_password);
  if (error){

  error_data.password_err=mes.message(error);
  f=1;
  }

  /*var txt ='{ "confirmPass":"'+app.confirmPass+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_password);
  if (error){
    console.log(app.password);
    console.log(app.confirmPass);
  error_data.confirm_err=mes.message(error);
  f=1;
}*/

  var txt ='{ "address":"'+app.address+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_address);
  if (error){
  error_data.address_err=mes.message(error);
  f=1;
  }

  var txt ='{ "dob":"'+app.dob+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_dob);
  if (error){
  error_data.dob_err=mes.message(error);
  f=1;
  }

  var txt ='{ "phone":"'+app.phone+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_phone);
  if (error){
  error_data.phone_err=mes.message(error);
  f=1;
  }

  var txt ='{ "gender":"'+app.gender+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_gender);
  if (error){
  error_data.gender_err=mes.message(error);
  f=1;
  }

  if(f==0)
    error_data.success='/pricing';
  return error_data;
}
