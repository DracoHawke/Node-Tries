<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
<script>
function myAjax() {
    var e = document.getElementById('word_check');
    console.log(e.value);
    $.ajax({
         type: "POST",
         url: './php.php',
         data:{action:'call_this',word:e.value},
         success:function(html) {
           html = html.split("%#120#%");
           console.log(html);
           var buttons = "";
           for(var i=0;i<html.length;i++) {
             buttons = buttons + "<a class='btn btn-primary' href='"+html[i+1]+"'>"+html[i]+"</a>&nbsp;";
             i = i+1;
           }
           document.getElementById('a1').innerHTML = "<h1>Your reports are ready</h1><p>Click on the links below to get the related files:</p>"+buttons;
         }
    });
}
</script>
<form action="php.php" method="post">
<p>Search:</p><input type="text" class="form-control" id="word_check" name="word" value="" placeholder="Enter Keyword">
<input hidden name ="action" value="call_this">
<p></p><button onclick="myAjax()">mytries1</button>
</form>
<div id="a1"></div>
