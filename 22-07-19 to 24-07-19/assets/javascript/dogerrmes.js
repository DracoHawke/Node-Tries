
exports.message=function(err){
  switch (err.details[0].type) {
    case "string.regex.base":
      err.details[0].message = "Incorrect Name";
      break;
    case "any.allowOnly":
      err.details[0].message = "Nope";
    default:
      break;
  }
  return(err.details[0].message);
};
