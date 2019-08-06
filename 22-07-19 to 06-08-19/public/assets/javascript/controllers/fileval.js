const path = require('path');

module.exports=function(file,data_err){
  console.log(file);
  var upload=file.fileUpload;
  console.log(upload.name);
  var g=['.png','.jpeg','.jpg'];
  console.log(g.indexOf(path.extname(upload.name.toLowerCase())));
  if(upload.name!=''){
    if(g.indexOf(path.extname(upload.name.toLowerCase()))>=0){
        if(upload.size> 10000000)
          data_err.file_err='Size Must Be Less Than 10MB';
        else
          data_err.file_err='';
    }
    else
      data_err.file_err='Only jpeg, jpg and png Files are Allowed';
  }
  else
    data_err.file_err='Cannot Be Left Empty';
  return data_err;
}
