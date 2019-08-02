function update() {
  event.preventDefault();
	var fd=$("form")[0];
	var formdata=new FormData(fd);
	//var queryString = new URLSearchParams(formdata).toString();
	var h="/myacc";
  //console.log(formdata);
	$.ajax({
		url: h,
		type: "POST",
    processData: false,
    contentType: false,
    data:formdata,
		success: function(data) {
			var data1 = jQuery(data).filter("#list").html();
			if(typeof(data1)=="undefined") {
		     data1 = jQuery("#list > *", data);
			}
			jQuery("#list").html(data1);
		}
	});
	return false;
}

function dlt(url) {
	 if (typeof (history.pushState) != "undefined") {
		$.ajax({
			url: url,
			type: "GET",
			success: function(data) {
				var data1 = jQuery(data).filter("#list").html();
				if(typeof(data1)=="undefined")
				{
			     data1 = jQuery("#list > *", data);
				}
				jQuery("#list").html(data1);
			}
		});
	}
	else  {
		window.location.href=url;
	}
	return false;
}

$(document).ready(function(){
  $(document).on('click','.for_ajax',function(){
    var href = $(this).attr('href');
    dlt(href);
    return false;
  });
});
