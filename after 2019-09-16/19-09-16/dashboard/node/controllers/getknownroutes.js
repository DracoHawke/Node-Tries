db_connect = require('./db-connect');

con = db_connect();

module.exports = function(req,res) {
  console.log("pageno: ",req.query.pageno)
  if(req.query.pageno){
    var off = (req.query.pageno-1)*4;
    console.log(off);
    var pageno = Number(req.query.pageno);
    var queryString = "pageno="+req.query.pageno;
  }
  else {
    var off = 0;
    queryString = "pageno=1";
    pageno = 1;
  }
  var sql = "SELECT * FROM `routes`";
  con.query(sql,function(err,rows1) {
    if(err) throw err;
    var totalroutes = rows1.length;
    var sql = "SELECT * FROM `routes` ORDER BY `routes`.`Id` ASC LIMIT "+off+",4";
    con.query(sql,function(err,rows) {
      if(err) throw err;
      var data = {};
      var data_main = "";
      var modal_end = '</tbody></table></div></div><span id="blockreason_err_routes" style="color:red;"></span>'+
      '<div class = "modal-footer">'+
      '<button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button></div></div></div>';
      var modal = '<div class="modal-dialog modal-routes"><div class="modal-content"><div id="bootstrap_alert_routes"></div>'+
      '<div class="modal-header"><h3>Routes Created</h3><p> To Include the page as a part in any other page use the Code Block below. </p>'+
      '<p> Use the Link below to refer this route in any href/anchor/link on any other page.</p></div>'+
      '<div class="modal-body" id="addform_list"><div class="table-responsive"><table class="table"><thead>'+
      '<tr style="background:rgb(247, 248, 250);border:0;"><th><span class="d-flex">Id</span>'+
      '</th><th>Name</th><th><span class="d-flex">Link</span></th><th><span class="d-flex">Code Block</span></th>'+
      '<th><span class="d-flex">Created_on&nbsp;&nbsp;</span></th></tr></thead><tbody>';
      var len = rows.length;
      console.log(len);
      var item = "";
      if(len == 0) {
        res.send(modal+modal_end);
      }
      else {
        var pagination = '<tr><td colspan="5"><ul class="pagination" style="float:right">';
        if(pageno != 1) {
          pageno2 = pageno-1;
          var pagitems = '<li class="page-item"><a class="page-link mypage" href="#" onclick="getknownroutes('+pageno2+')"> < </a></li>'
        }
        else{
          var pagitems = "";
        }
        var flag = 1;
        for(var i = 0; i < Math.ceil(totalroutes/4); i++){
          pageno2 = i + 1;
          console.log("pagitems: ",pagitems);
          if(pageno == i + 1 || i == 0 || pageno == Math.ceil(totalroutes/4)-1  || pageno == i || pageno == i+2){
            pagitems = pagitems + '<li class="page-item';
            if (pageno == i+1) {
              pagitems = pagitems + ' active';
            }
            pagitems = pagitems+'"><a class="page-link mypage" href="#" onclick="getknownroutes('+pageno2+')">'+(i+1)+'</a></li>';
            flag = 1;
          }
          else if(flag==1) {
            pagitems = pagitems+'<li class="page-item"><a class="page-link mypage">...</a></li>';
            flag = 0;
          }
        }
        if(pageno != i && Math.ceil(totalroutes/4) >= 1){
          pageno2 = (pageno+1);
          pagitems = pagitems + '<li class="page-item"><a class="page-link mypage" href="#"';
          pagitems = pagitems + ' onclick="getknownroutes('+pageno2+')"> > </a> </li>';
        }
        pagitems = pagitems + '</ul></td></tr>';
        pagination = pagination + pagitems;
        modal_end = pagination + modal_end;
        var item = "";
        for(i = 0; i < len; i++) {
          data = rows[i];
          var d = new Date(data.Date);
          console.log(data.Date);
          var date = '';
          if(d.getDate()<10)
            date = date +'0'+ d.getDate() + '-';
          else
            date = date + d.getDate() + '-';
          if(d.getMonth()<9)
            date = date +'0'+ (d.getMonth()+1) + '-';
          else
              date = date + (d.getMonth()+1) + '-';
          date = date + d.getFullYear();
          var page = data.Route.substr(1);
          var url = "/getdataofpage/1?route='"+data.Route+"'";
          item = '<tr><td><span class="t_data">' + (Number(i)+1) + '</span></td>';
          item = item + '<td><span>' + page + '</span></td><td><input type="text" class="form-control" value="/getknownroutes'+
            data.Route+'" readonly></td>';
          var response = "";
          var content1 = '<div id="unique_id_'+page+'"></div><script>function ajax_call_'+page+'(){ $.ajax({'+
            'url:"'+url+'",type: "GET",success: function(response) {'+
            'document.getElementById("unique_id_'+page+'").innerHTML = response;}}); } ajax_call_'+page+'();</script>';
          item = item + '<td><textarea rows="4" style="width:100%;">' + content1 + '</textarea></td>';
          item = item + '<td style="text-align:left;"><span>' + date + '</span></td></tr>';
          modal = modal + item;
        }
        data_main = modal + modal_end;
        var data1 = {};
        res.send("successful1"+data_main);
      }
    })
  })
}
