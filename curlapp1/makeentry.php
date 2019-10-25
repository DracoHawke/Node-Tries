<?php
  function file_get_contents_curl($url) {
    $ch2 = curl_init();

    curl_setopt($ch2, CURLOPT_HEADER, 0);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch2, CURLOPT_URL, $url);
    $data = curl_exec($ch2);
    curl_close($ch2);
    return $data;
  }

  $row1 = $conn -> query('SELECT `data_id` FROM data WHERE `dt_url` = "'.mysqli_real_escape_string($conn,$url).'"');
  if($row1->num_rows == 0){
    $result = $conn -> query("INSERT INTO data(`dt_url`,`dt_object`,`dt_variations`,`dt_no_of_images`,`dt_allinfo`) VALUES ('".mysqli_real_escape_string($conn,$url)."','".mysqli_real_escape_string($conn,json_encode($detailedfeatures))."','".mysqli_real_escape_string($conn,json_encode($variations))."',".sizeof($mainimagearr).",'".mysqli_real_escape_string($conn,json_encode($allotherfeatures))."')");
    if($result) {
      $row2 = $conn -> query('SELECT `data_id` FROM data ORDER BY `data_id` DESC');
      $data = $row2 -> fetch_assoc();
      $urlid = $data['data_id'];
      $number = sizeof($mainimagearr);
      $i = 0;
      $target_dir = 'images/'.$urlid.'/product';
      if (!file_exists($target_dir)) {
        mkdir($target_dir, 0755, true);
      }
      while($number > 0) {
        $data1 = file_get_contents_curl($mainimagearr[$i]);
        $i++;
        $number--;
        $move1 = $target_dir."/img".$i.".jpg";
        file_put_contents($move1,$data1);
      }
      foreach ($variations as $key => $value) {
        if(gettype($value) == 'array'){
          foreach ($value as $key1 => $value1) {
            if(gettype($value1) == 'array' && isset($value1['img'])){
              $target_dir = 'images/'.$urlid.'/variations/'.$key;
              if (!file_exists($target_dir)) {
                mkdir($target_dir, 0755, true);
              }
              $data1 = file_get_contents_curl($value1['img']);
              //echo $value1['img']."<br><hr><br>".$data1."<br><hr><br>";
              $move1 = $target_dir."/img_".$value1['id'].".jpg";
              file_put_contents($move1,$data1);
            }
          }
        }
      }
      echo "File downloaded!";
    }
    else{
      echo "RESULT1(FAILED): INSERT INTO data(`dt_url`,`dt_object`,`dt_variations`,`dt_no_of_images`) VALUES ('".$url."','".json_encode($detailedfeatures)."','".json_encode($variations)."',".sizeof($mainimagearr).")";
    }
  }
  else {
    $data = $row1 -> fetch_assoc();
    echo "ENTRY ALREADY PRESENT:".$data['data_id']."<br>";
  }
?>
