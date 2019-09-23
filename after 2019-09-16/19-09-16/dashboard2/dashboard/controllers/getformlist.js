
db_connect = require('./db-connect');

con = db_connect();

module.exports = function(req,res) {
  var sql = 'SELECT `forms`.`FormName`,`forms`.`Id`,`forms`.`Date` FROM `forms` ORDER BY `forms`.`Date` DESC';
  con.query(sql,function(err,rows){
    if(err) throw err;
    var data = {};
    var data_main = "";
    var modal_end = '</tbody></table></div></div><span id="blockreason_err2" style="color:red;"></span>'+
    '<div class = "modal-footer"><button type="submit" class="btn btn-theme">Insert</button>'+
    '<button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button></div></form></div></div>';
    var modal = '<div class="modal-dialog"><div class="modal-content"><div id="bootstrap_alert2"></div>'+
    '<div class="modal-header">Forms-Templates</div>'+
    '<form id="FormPage" onsubmit="return addformpage_action()" name="formpageadder" enctype="multipart/form-data">'+
    '<div class="modal-body" id="addform_list"><div class="table-responsive"><table class="table"><thead>'+
    '<tr style="background:rgb(247, 248, 250);border:0;"><th><span class="d-flex">Select&nbsp;&nbsp;</span>'+
    '</th><th>Id</th><th>Name</th><th><span class="d-flex">Created_on&nbsp;&nbsp;</span></th>'+
    '</tr></thead><tbody>';
    var len = rows.length;
    console.log(len);
    var item = "";
    for(i = 0; i < len; i++){
      data = rows[i];
      var d = new Date(data.Date);
      console.log(data.Date);
      var date='';
      if(d.getDate()<10)
        date = date +'0'+ d.getDate() + '-';
      else
        date = date + d.getDate() + '-';
      if(d.getMonth()<9)
        date = date +'0'+ (d.getMonth()+1) + '-';
      else
          date = date + (d.getMonth()+1) + '-';
      date = date + d.getFullYear();
      item = '<tr><td><input type="radio" name="forminsert" value="'+data.Id+'"></td>';
      item = item + '<td><span>' + data.Id + '</span></td><td><span>' + data.FormName + '</span></td>';
      item = item + '<td style="text-align:left;"><span>' + date + '</span></td></tr>';
      modal = modal + item;
    }
    data_main = modal + modal_end;
    var data1 = {};
    res.send("successful1"+data_main);
  })
}
