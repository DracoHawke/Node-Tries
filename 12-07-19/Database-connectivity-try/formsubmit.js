$(function() {
  $('#create-form').on('submit', function(event) {
    event.preventDefault();
    var formData=new FormData(document.getElementById('Login'));
    console.log(FormData);
    //$.ajax({
      //url: '/products',
    //  method: 'POST',
  //    contentType: 'application/json',
  //    data: formData,
    //  success: function(response) {
    //    console.log(response);
    //    createInput.val('');
        //$('#get-button').click();
  //    }
//    });
  });
});
