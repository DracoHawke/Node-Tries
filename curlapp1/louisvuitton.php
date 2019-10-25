<?php

  function getdatastring($liststring2) {
    $arr1 = explode('</',$liststring2);
    $arr2 = explode('>',$arr1[0]);
    $liststring2 = $arr2[sizeof($arr2)-1];
    return $liststring2;
  }


  function getdatastring2($liststring2) {
    //$arr1 = explode('<!--',$liststring2);
    $arr2 = explode('-->',$liststring2);
    $liststring2 = $arr2[sizeof($arr2)-1];
    return $liststring2;
  }

  $arr1 = explode('id="productSheetSlideshow"',$result);
  $arr1 = explode('id="infoProductBlock"',$arr1[1]);
  $arr1 = explode('is="lv-picture"',$arr1[0]);
  $arr1copy = $arr1;
  $mainimagearr = [];
  $i = 0;
  echo "<br>IMAGES<br>";
  foreach($arr1 as $key => $value) {
    $try1 = explode('</picture>',$value);
    if(sizeof($try1) > 1){
      $value1 = $try1[0];
      $value2 = $try1[1];
      $try2 = explode('<source',$value1);
      if(sizeof($try2) > 1){
        $try4 = explode('data-src="',$try2[1]);
        if(sizeof($try4) > 1){
          $try5 = explode('"',$try4[1]);
          if(substr_count($try5[0],"http")){
            if(!(in_array($try5[0],$mainimagearr))){
              array_push($mainimagearr,$try5[0]);
              echo "<div style='display: inline;'><img onerror='removeimage(this)' src='".$try5[0]."' style='height:200px;width:200px;'></div>";
            }
          }
        }
      }
    }
  }
  foreach($arr1 as $key => $value) {
    $try1 = explode('<img',$value);
    if(sizeof($try1) > 1){
      $value1 = $try1[1];
      $try2 = explode('src="',$value1);
      if(sizeof($try2) > 1) {
        $try3 = explode('"',$try2[1]);
        if(in_array($try3[0],$mainimagearr) or sizeof($try3) == 0){}else{
          if(substr_count($try3[0],"http")){
            array_push($mainimagearr,$try3[0]);
            echo "<div><img onerror='removeimage(this)' src='".$try3[0]."' style='height:200px;width:200px;'></div>";
          }
        }
      }
    }
  }
  echo "<br><hr><br>";
  $skuarr1 = explode('class="sku">',$result);
  $skuarr2 = explode('<',$skuarr1[1]);
  $sku = $skuarr2[0];
  //echo "<br><br>Product SKU: <b>$sku</b><br><hr><br>";
  $arr2 = explode('id="productName">',$result);
  if(sizeof($arr2) > 1) {
    $headarr = explode("<",$arr2[1]);
    $heading = $headarr[0];
    //echo "Product Name: <h2>".$heading."</h2><br><hr><br>";
  }
  $sizes = [];
  $sizearr1 = explode('id="modelSize"',$result);
  if(sizeof($sizearr1) > 1) {
    //echo sizeof($sizearr1);
    $sizearr1 = explode('</ul>',$sizearr1[1]);
    //echo $sizearr1;
    $optionsarr1 = explode('</span>',$sizearr1[0]);
    for($i = 0; $i < sizeof($optionsarr1); $i++) {
      //echo "i = ".$i.", ".$optionsarr1[$i]."<br>";
      $optionarr2 = explode('<span',$optionsarr1[$i]);
      //print_r($optionarr2);
      if(sizeof($optionarr2) > 1) {
        $optionarr3 = explode('>',$optionarr2[1]);
        $optionstring1 = $optionarr3[1];
        array_push($sizes,$optionstring1);
      }
    }
  }
  else {
    $sizearr1 = explode('id="size"',$result);
    if(sizeof($sizearr1) > 1) {
      //echo sizeof($sizearr1);
      $sizearr1 = explode('</ul>',$sizearr1[1]);
      //echo $sizearr1;
      $optionsarr1 = explode('</span>',$sizearr1[0]);
      for($i = 0; $i < sizeof($optionsarr1); $i++) {
        //echo "i = ".$i.", ".$optionsarr1[$i]."<br>";
        $optionarr2 = explode('<span',$optionsarr1[$i]);
        //print_r($optionarr2);
        if(sizeof($optionarr2) > 1) {
          $optionarr3 = explode('>',$optionarr2[1]);
          $optionstring1 = $optionarr3[1];
          array_push($sizes,$optionstring1);
        }
      }
    }
  }
  //print_r($sizes);
  $variations = [];
  if(sizeof($sizes) > 0) {
    /*echo "sizes:<ul> ";
    foreach ($sizes as $key => $value) {
      echo "<li>$value</li>";
    }
    echo "</ul><br><br><hr>";*/
    $variations['sizes'] = $sizes;
  }
  $arr3 = explode('class="topPanelTitle">',$result);
  if(sizeof($arr3) > 1) {
    $i1 = 1;
    //echo sizeof($arr3);
    while($i1 < sizeof($arr3)) {
      $headerarr1 = explode('>',$arr3[$i1]);
      //print_r($headerarr1);
      $headerarr2 = explode('<',$headerarr1[1]);
      if(!isset($variations[$headerarr2[0]])){
        $variations[$headerarr2[0]] = [];
      }
      $data1 = $arr3[$i1];
      $list1 = explode('<ul',$data1);
      $list2 = explode('</ul>',$list1[1]);
      $list3 = explode('<li',$list2[0]);
      $i2 = 1;
      while($i2 < sizeof($list3)) {
        $list4 = explode('<img',$list3[$i2]);
        $list5 = explode('>',$list4[1]);
        $name1 = explode('alt="',$list5[0]);
        $name2 = explode('"', $name1[1]);
        $src1 = explode('src="',$list5[0]);
        $src2 = explode('"',$src1[1]);
        $variations[$headerarr2[0]][$i2-1]['id'] = $i2-1;
        $variations[$headerarr2[0]][$i2-1]['name'] = $name2[0];
        $variations[$headerarr2[0]][$i2-1]['img'] = $src2[0];
        //echo $list5[0]."<br>";
        $i2 += 1;
      }
      $i1 += 1;
    }
  }
  echo "Variatons:<ul>";
  foreach ($variations as $key => $value) {
    echo "<li><h3>$key</h3></li><ol>";
    if(gettype($value) == 'array'){
      foreach ($value as $key1 => $value1) {
        echo "<li>";
        print_r($value1);
        echo "</li>";
        //echo "<li> Name: ".$value1['name'].",   Image: ".$value1['img']."</li>";
      }
    }
    else {

    }
    echo "</ol>";
  }
  echo "</ul><br><br><hr>";
  $pricearr1 = explode('class="priceValue">',$result);
  $pricearr2 = explode('<',$pricearr1[1]);
  $price = $pricearr2[0];
  $descriptionarr1 = explode('<div id="productDescription">',$result);
  $descriptionarr2 = explode('</div>',$descriptionarr1[1]);
  $description = "<br>".$descriptionarr2[0].'</div>';
  $featurearr1 = explode('<div id="productFeatures"',$result);
  $featurearr2 = explode('id="clientInfo"',$featurearr1[1]);
  $lastpos = strripos($featurearr2[0],"</div>");
  $features = '<div id="productFeatures"'.substr($featurearr2[0],0,($lastpos-strlen($featurearr2[0]))).'</div>';
  $btnarr1 = explode('<button',$features);
  if(sizeof($btnarr1) > 1){
    $divcount = substr_count('</div>',$btnarr1[1]);
    $counter2 = 1;
    while(true){
      if($counter2 <= $divcount) {
        $btnarr1[0] = '</div>'.$btnarr1[0];
        $counter2 += 1;
      }
      else{
        break;
      }
    }
    $features = $btnarr1[0];
  }
  echo "<br> Other Features:<br><br>";
  //print_r($features);
  $stringarr1 = explode('<ul',$features);
  $lengthincm = "depending on size";
  $detailedfeatures = [];
  if(sizeof($stringarr1) > 1) {
    $lengthincm1 = $stringarr1[0];
    //echo $lengthincm1;
    $lengthincmarr1 = explode('<div',$lengthincm1);
    //print_r($lengthincmarr1);
    $lengthincm2 = $lengthincmarr1[(sizeof($lengthincmarr1) - 1)];
    //echo $lengthincm2;
    $lengthincmarr2 = explode('">',$lengthincm2);
    if(sizeof($lengthincmarr2) > 1) {
      $lengthincm3 = $lengthincmarr2[1];
      //echo $lengthincm3;
      $lengthincmarr3 = explode('<br>',$lengthincm3);
      if(sizeof($lengthincmarr3) > 1) {
        $size1 = str_ireplace("&nbsp;"," ",$lengthincm1[0]);
        $dimensions1 = str_ireplace("&nbsp;"," ",$lengthincm1[1]);
        $lengthincm = $size1."\n".$dimensions1;
      }
      else{
        $lengthincm = str_ireplace("&nbsp;"," ",$lengthincm3);
      }
    }
    $allotherfeatures = [];
    $detailedfeatures['length in cm'] = $lengthincm;
    $listarr1 = explode("</ul>",$stringarr1[1]);
    $liststring1 = $listarr1[0];
    $listarr2 = explode("<li>",$liststring1);
    for($i = 1; $i < sizeof($listarr2); $i++) {
      $liststring2 = str_ireplace("</li>","",$listarr2[$i]);
      array_push($allotherfeatures,$liststring2);
      $lowerliststring2 = strtolower($liststring2);
      $stringcount1 = substr_count($lowerliststring2,'lining');
      if($stringcount1 >= 1) {
        $text = str_ireplace("lining","",$liststring2);
        $detailedfeatures['lining'] = $text;
      }
      else{
        $stringcount1 = substr_count($lowerliststring2,'hardware');
        if($stringcount1 >= 1) {
          $text = str_ireplace("hardware","",$liststring2);
          $detailedfeatures['hardware'] = $text;
        }
        else{
          $stringcount1 = substr_count($lowerliststring2,'closure');
          if($stringcount1 >= 1) {
            $detailedfeatures['closure'] = $liststring2;
          }
          else{
            $stringcount1 = substr_count($lowerliststring2,'strap');
            $stringcount2 = substr_count($lowerliststring2,'for');
            if($stringcount1 >=1 && $stringcount2 >= 1) {
              $listarr3 = explode('for',$lowerliststring2);
              $listarr4 = explode('strap',$listarr3[0]);
              $text = str_ireplace('strap',"",$listarr4[1]);
              $text = str_ireplace('(',"",$text);
              $text = str_ireplace(')',"",$text);
              $detailedfeatures['strap measurement'] = $text;
              if(trim($listarr4[0]) != "") {
                $detailedfeatures['strap type'] = $listarr4[0];
              }
              else {
                $detailedfeatures['strap type'] = "Normal";
              }
            }
            else{
              $stringcount1 = substr_count($lowerliststring2,'strap');
              $stringcount2 = substr_count($lowerliststring2,'drop');
              if($stringcount1 >=1 && $stringcount2 >= 1) {
                $text = $liststring2;
                $text = explode(':',$liststring2);
                $detailedfeatures['strap measurement'] = $text[1];
              }
              else{
                $stringcount1 = substr_count($lowerliststring2,"inches");
                $stringcount2 = substr_count($lowerliststring2,"inch");
                if(($stringcount1 == 1 || $stringcount2 == 1)) {
                  $detailedfeatures['length in inches'] = $liststring2;
                }
                else{
                  $stringcount1 = substr_count($lowerliststring2,"carry");
                  if($stringcount1 >= 1) {
                    $detailedfeatures['style'] = $liststring2;
                  }
                  else {
                    $stringcount1 = substr_count($lowerliststring2,"inside");
                    $stringcount2 = substr_count($lowerliststring2,"interior");
                    if($stringcount1 >= 1 || $stringcount2 >= 1) {
                      if(isset($detailedfeatures['Interior Pockets'])) {
                        $detailedfeatures['Interior Pockets'] .= ", ".$liststring2;
                      }
                      else {
                        $detailedfeatures['Interior Pockets'] = $liststring2;
                      }
                    }
                    else {
                      $stringcount1 = substr_count($lowerliststring2,"outside");
                      $stringcount2 = substr_count($lowerliststring2,"exterior");
                      if($stringcount1 >= 1 || $stringcount2 >= 1) {
                        if(isset($detailedfeatures['Exterior Pockets'])){
                          $detailedfeatures['Exterior Pockets'] .= ", ".$liststring2;
                        }
                        else {
                          $detailedfeatures['Exterior Pockets'] = $liststring2;
                        }
                      }
                      else{
                        if($i == 2) {
                          $detailedfeatures['color'] = explode(" ",$liststring2)[0];
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  else {
    $allotherfeatures = [];
    $listarr1 = explode("id='text_productFeatures' ",$features);
    $liststring1 = $listarr1[1];
    //echo "<br>in here<br>";
    $listarr2 = explode("<br",$liststring1);
    //print_r($listarr2);
    $listarr3 = [];
    foreach ($listarr2 as $key => $value) {
      $value = str_ireplace("/>","",$value);
      $value = str_ireplace('<br>',"",$value);
      $value = trim($value);
      //echo "value=: ".$value."<br>";
      if(substr($value,0,1) == '-') {
        $number = substr_count($value,'-');
        if($number > 1){
          $subarr1 = explode('- ',$value);
          if(sizeof($subarr1) > 1) {
            for($m = 1;$m < sizeof($subarr1);$m++){
              array_push($listarr3,$subarr1[$m]);
            }
          }
        }
      }
      else {
        array_push($listarr3,$value);
      }
    }
    $listarr2 = $listarr3;
    for($i = 1; $i < sizeof($listarr2); $i++) {
      $liststring2 = str_ireplace(">","",$listarr2[$i]);
      $liststring2 = str_ireplace('<br>',"",$liststring2);
      $liststring2 = str_ireplace('<br/>',"",$liststring2);
      $liststring2 = str_ireplace('<br/ >',"",$liststring2);
      array_push($allotherfeatures,$liststring2);
      $lowerliststring2 = strtolower($liststring2);
      $stringcount1 = substr_count($lowerliststring2,'lining');
      if($stringcount1 >= 1) {
        $text = str_ireplace("lining","",$liststring2);
        $detailedfeatures['lining'] = $text;
      }
      else{
        $stringcount1 = substr_count($lowerliststring2,'hardware');
        if($stringcount1 >= 1) {
          $text = str_ireplace("hardware","",$liststring2);
          $detailedfeatures['hardware'] = $text;
        }
        else{
          $stringcount1 = substr_count($lowerliststring2,'closure');
          if($stringcount1 >= 1) {
            $detailedfeatures['closure'] = $liststring2;
          }
          else{
            $stringcount1 = substr_count($lowerliststring2,'strap');
            $stringcount2 = substr_count($lowerliststring2,'for');
            if($stringcount1 >=1 && $stringcount2 >= 1) {
              $listarr3 = explode('for',$lowerliststring2);
              $listarr4 = explode('strap',$listarr3[0]);
              $text = str_ireplace('strap',"",$listarr4[1]);
              $text = str_ireplace('(',"",$text);
              $text = str_ireplace(')',"",$text);
              $detailedfeatures['strap measurement'] = $text;
              if(trim($listarr4[0]) != "") {
                $detailedfeatures['strap type'] = $listarr4[0];
              }
              else {
                $detailedfeatures['strap type'] = "Normal";
              }
            }
            else{
              $stringcount1 = substr_count($lowerliststring2,'strap');
              $stringcount2 = substr_count($lowerliststring2,'drop');
              if($stringcount1 >=1 && $stringcount2 >= 1) {
                $text = $liststring2;
                $text = explode(':',$liststring2);
                $detailedfeatures['strap measurement'] = $text[1];
              }
              else{
                $stringcount1 = substr_count($lowerliststring2,"inches");
                $stringcount2 = substr_count($lowerliststring2,"inch");
                if(($stringcount1 == 1 || $stringcount2 == 1)) {
                  $detailedfeatures['length in inches'] = $liststring2;
                }
                else{
                  $stringcount1 = substr_count($lowerliststring2,"carry");
                  if($stringcount1 >= 1) {
                    $detailedfeatures['style'] = $liststring2;
                  }
                  else {
                    $stringcount1 = substr_count($lowerliststring2,"inside");
                    $stringcount2 = substr_count($lowerliststring2,"interior");
                    if($stringcount1 >= 1 || $stringcount2 >= 1) {
                      if(isset($detailedfeatures['Interior Pockets'])) {
                        $detailedfeatures['Interior Pockets'] .= ", ".$liststring2;
                      }
                      else {
                        $detailedfeatures['Interior Pockets'] = $liststring2;
                      }
                    }
                    else {
                      $stringcount1 = substr_count($lowerliststring2,"outside");
                      $stringcount2 = substr_count($lowerliststring2,"exterior");
                      if($stringcount1 >= 1 || $stringcount2 >= 1) {
                        if(isset($detailedfeatures['Exterior Pockets'])){
                          $detailedfeatures['Exterior Pockets'] .= ", ".$liststring2;
                        }
                        else {
                          $detailedfeatures['Exterior Pockets'] = $liststring2;
                        }
                      }
                      else{
                        if($i == 2) {
                          //$detailedfeatures['color'] = explode(" ",$liststring2)[0];
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  //echo $lengthincm;

  $detailedfeatures['heading'] = $heading;
  $detailedfeatures['product sku'] = $sku;
  $detailedfeatures['price'] = $price;
  $detailedfeatures['description'] = $description;
  foreach ($detailedfeatures as $key => $value) {
    $value = str_ireplace('<br>',"",$value);
    $value = str_ireplace('<br/>',"",$value);
    $value = str_ireplace('<br/ >',"",$value);
    $detailedfeatures[$key] = $value;
    if(substr_count($value,'</') > 0) {
      $number = substr_count($value,'</');
      while($number > 0) {
        //echo "in.....<br>";
        $detailedfeatures[$key] = getdatastring($value);
        $number--;
      }
    }
    if(substr_count($value,'-->') > 0 && substr_count($value,'<!--') > 0) {
      $number = substr_count($value,'-->');
      while($number > 0) {
        //echo "in.....<br>";
        $detailedfeatures[$key] = getdatastring2($value);
        $number--;
      }
    }
  }
  echo "<ul>";
  foreach ($detailedfeatures as $key => $value) {
    echo "<li>$key: $value</li>";
  }
  echo "</ul><hr>";
  //print_r($allotherfeatures);
  include 'makeentry.php';
?>
