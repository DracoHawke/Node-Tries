
exports.message=function(err){
  switch (err.details[0].type) {
    case "string.regex.base":
      err.details[0].message = "does not match the correct pattern";
      break;
    case "any.allowOnly":
      err.details[0].message = "does not match the password";
    default:
      break;
  }
  return(err.details[0].message);
};
