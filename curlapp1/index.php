<?php include 'config.php'; ?>
<?php
  if($_SERVER["REQUEST_METHOD"]=="GET" && isset($_GET['url']) && $_GET['url'] != ""){
    // From URL to get webpage contents.
    $url = $_GET['url'];
    echo "Current URL: ".$url."<br><br><hr>";

    header("Access-Control-Allow-Origin: *");
    // Initialize a CURL session.
    $ch = curl_init();
    // Return Page contents.
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    // grab URL and pass it to the variable.
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    //print_r($result);
    $urlarray = explode('/',$url);
    //print_r($urlarray)
    if(substr_count(strtolower($urlarray[2]),"louisvuitton.") >= 1) {
      include 'louisvuitton.php';
    }
    else if(substr_count(strtolower($urlarray[2]),"gucci.") >= 1) {
      include 'gucci.php';
    }
    else if(substr_count(strtolower($urlarray[2]),"ysl.") >= 1) {
      include 'ysl.php';
    }
    else if(substr_count(strtolower($urlarray[2]),"celine.") >= 1) {
      include 'celine.php';
    }
    else if(substr_count(strtolower($urlarray[2]),"chanel.") >= 1) {
      include 'chanel.php';
    }
  }
  else {
?>
<form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>" method="get" target="_blank">
  <input type="text" name="url" value="" style="height: 100px;width: 95%;">
  <button type="submit">enter</button>
</form>
<?php
  }
?>
<script>

  //console.log(<?php //print_r($sizes); ?>);
  function removeimage(element) {
    var parent = element.parentNode;
    parent.innerHTML = "";
  }

</script>
