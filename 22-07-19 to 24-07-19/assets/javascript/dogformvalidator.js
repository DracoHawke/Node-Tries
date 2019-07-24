var Joi = require('@hapi/joi');
var mes=require('./dogerrmes');

const schema_name = Joi.object().keys({dog_name: Joi.string().min(3).max(30).required()})
const schema_breed = Joi.object().keys({dog_breed: Joi.string().regex(/^[a-zA-Z\\s]*$/).required()})
const schema_gender = Joi.object().keys({dog_gender: Joi.string().valid(['Male','Female']).required()})
const schema_age = Joi.object().keys({dog_age:Joi.string().regex(/^\w[0-9]{0}[0]*\.?\w{1}$/).required()})
const schema_info = Joi.object().keys({dog_info:Joi.string().allow('').optional() })

exports.fval=function(app){
  var error_data={success:''};
  var f=0;
  var txt ='{ "dog_name":"'+app.dog_name+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_name);
  if (error){
    error_data['dog_name'+app.form1+'_err']=mes.message(error);
    f=1;
  }
  var txt ='{ "dog_breed":"'+app.dog_breed+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_email);
  if (error){
    error_data['dog_breed'+app.form1+'_err']=mes.message(error);
    f=1;
  }
  var txt ='{"dog_gender":"'+app.dog_gender+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_password);
  if (error){
    error_data['dog_gender'+app.form1+'_err'] = mes.message(error);
    f=1;
  }
  var txt ='{ "dog_age":"'+app.dog_age+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_address);
  if (error){
    error_data['dog_age'+app.form1+'_err']=mes.message(error);
    f=1;
  }

  var txt ='{ "dog_info":"'+app.dog_info+'"}';
  var obj = JSON.parse(txt);
  var { error } =Joi.validate(obj, schema_dob);
  if (error){
    error_data['dog_info'+app.form1+'_err']=mes.message(error);
    f=1;
  }
  if(f==0){
    error_data.success='Yes';
  }
  return error_data;
}
