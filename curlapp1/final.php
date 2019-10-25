<?php
  if(isset($_GET['links']) && $_GET['links'] != "") {
    //echo $_GET['links'];
    $arr1 = explode("thisislink",$_GET['links']);
    //print_r($arr1);
?>
<style>
  img {
    height:200px;
    width:200px;
  }
</style>
    <div>
      <?php
        for($i = 1; $i < sizeof($arr1); $i++){
      ?>
          <img src="<?php echo $arr1[$i]; ?>"><br>
      <?php
        }
      ?>
    </div>
<?php
  }
?>
