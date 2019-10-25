<?php

  $allotherfeatures = [];

  function getdatastring($liststring2){
    $arr1 = explode('</',$liststring2);
    $arr2 = explode('>',$arr1[0]);
    $liststring2 = $arr2[sizeof($arr2)-1];
    return $liststring2;
  }

  function description_function($detailedfeatures,$descriptionstring,$i){
    $liststring2 = $descriptionstring;
    if(substr_count($liststring2,'>') >= 1){
      $liststring2 = getdatastring($liststring2);
    }
    $lowerliststring2 = strtolower($liststring2);
    $flagline1 = 0;
    if(substr_count($lowerliststring2,'dimensions') > 0){
      $liststring2 = $descriptionstring;
      $lowerliststring2 = strtolower($liststring2);
      $dimensionarr['width'] = explode('</span>',(explode('class="value">',explode('class="width"',$lowerliststring2)[1])[1]))[0];
      $dimensionarr['height'] = explode('</span>',(explode('class="value">',explode('class="height"',$lowerliststring2)[1])[1]))[0];
      $dimensionarr['depth'] = explode('</span>',(explode('class="value">',explode('class="depth"',$lowerliststring2)[1])[1]))[0];
      $dimensionarrtype = explode(' ',$dimensionarr['depth'])[1];
      if(strtolower($dimensionarrtype) == 'cm'){
        $line = "Dimensions ".implode(' X ',$dimensionarr);
        array_push($detailedfeatures['allotherfeatures'],$line);
        $flagline1 = 1;
      }
    }
    if($flagline1 == 0){
      array_push($detailedfeatures['allotherfeatures'],$liststring2);
    }
    $stringcount1 = substr_count($lowerliststring2,'lining');
    if($stringcount1 >= 1) {
      //echo "LININGGGGGGGGG<br>";
      //$text = str_ireplace("lining","",$liststring2);
      $detailedfeatures['lining'] = $liststring2;
    }
    else{
      $stringcount1 = substr_count($lowerliststring2,'hardware');
      if($stringcount1 >= 1) {
        //$text = str_ireplace("hardware","",$liststring2);
        $detailedfeatures['hardware'] = $liststring2;
      }
      else{
        $stringcount1 = substr_count($lowerliststring2,'closure');
        if($stringcount1 >= 1) {
          $detailedfeatures['closure'] = $liststring2;
        }
        else{
          $stringcount1 = substr_count($lowerliststring2,'dimensions');
          if($stringcount1 >= 1) {
            $liststring2 = $descriptionstring;
            $lowerliststring2 = strtolower($liststring2);
            //echo "<br>True : $lowerliststring2<br>";
            $dimensionarr['width'] = explode('</span>',(explode('class="value">',explode('class="width"',$lowerliststring2)[1])[1]))[0];
            $dimensionarr['height'] = explode('</span>',(explode('class="value">',explode('class="height"',$lowerliststring2)[1])[1]))[0];
            $dimensionarr['depth'] = explode('</span>',(explode('class="value">',explode('class="depth"',$lowerliststring2)[1])[1]))[0];
            //print_r($dimensionarr);
            $dimensionarrtype = explode(' ',$dimensionarr['depth'])[1];
            if(strtolower($dimensionarrtype) == 'cm'){
              $detailedfeatures['length in cm'] = implode(' X ',$dimensionarr);
            }
          }
          else{
            $stringcount1 = substr_count($lowerliststring2,'strap');
            if($stringcount1 >=1 && !(isset($detailedfeatures['strap type']))) {
              $detailedfeatures['strap type'] = $liststring2;
            }
            else {
              $stringcount1 = substr_count($lowerliststring2,'strap');
              $stringcount2 = substr_count($lowerliststring2,'drop');
              if($stringcount1 >=1 && $stringcount2 >= 1) {
                $text = $liststring2;
                //$text = explode(':',$liststring2);
                $detailedfeatures['strap measurement'] = $text;
              }
              else {
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
                      else {
                        $stringcount1 = substr_count($lowerliststring2,"made in");
                        if($stringcount1 >= 1) {
                          $detailedfeatures['made in'] = $liststring2;
                        }
                        else{
                          if($i == 2) {
                            $detailedfeatures['material'] = $liststring2;
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
    return $detailedfeatures;
  }

  $colorarr1 = explode('id="itemcolor_radiogroup"',$result);
  $colorarr2 = explode('</ul>"',$colorarr1[1]);
  $arr1 = explode('class="itempage-images-content"',$result);
  $arr2 = explode('</ul>',$arr1[1]);
  $arr3 = explode('<li',$arr2[0]);
  $mainimagearr = [];
  for($i = 1;$i < sizeof($arr3); $i++) {
    $arr4 = explode('<img',$arr3[$i]);
    $arr5 = explode('srcset="',$arr4[1]);
    $arr6 = explode('"',$arr5[1]);
    $arr7 = explode(' ',$arr6[0]);
    if(sizeof($arr7) > 3){
      $lastimg = explode(",",$arr7[(sizeof($arr7) - 2)]);
      if(!(in_array($lastimg[1],$mainimagearr))){
        array_push($mainimagearr,$lastimg[1]);
      }
    }
  }
  echo "IMAGE(S)<br><br>";
  foreach ($mainimagearr as $key => $value) {
    echo "<div style='display: inline;'><img onerror='removeimage(this)' src='".$value."' style='height:200px;width:200px;'></div>";
  }
  echo "<br><br><hr>";
  $maindata = [];
  $namearr1 = explode('class="productName" aria-label="',$result);
  $namearr2 = explode('">',$namearr1[1]);
  echo "<br>Product Name: ".$namearr2[0]."<br><br><hr>";
  $pricearr1 = explode('id="itemPrice"',$result);
  $pricearr2 = explode('class="price"',$pricearr1[1]);
  $pricearr3 = explode('</div>',$pricearr2[1]);
  $pricearr4 = explode('</span>',$pricearr3[0]);
  foreach ($pricearr4 as $key => $value) {
    $lowerstring1 = strtolower($value);
    if(substr_count($lowerstring1,'class="value"') > 0) {
      $pricearr5 = explode('<span',$value);
      $pricearr6 = explode('>',$pricearr5[1]);
      echo "Price=".$pricearr6[1]."<br><br>";
      $maindata['price'] = $pricearr6[1];
    }
  }
  $descriptionarr1 = explode('class="descriptionContent"',$result);
  $descriptionheaderarr1 = explode('<h2>',$descriptionarr1[1]);
  $descriptionheaderarr2 = explode('</h2>',$descriptionheaderarr1[1]);
  echo "<br>description = ".$descriptionheaderarr2[0]."<br><br><hr>";
  $maindata['description'] = $descriptionheaderarr2[0];
  $descriptionarr2 = explode('class="accordion-tab"',$descriptionarr1[1]);
  echo "<br>Detailed Features: <br>";
  $descriptionarr3 = explode('</li>',$descriptionarr2[1]);
  array_pop($descriptionarr3);
  $detailedfeatures = [];
  $i = 1;
  $detailedfeatures['allotherfeatures'] = [];
  foreach ($descriptionarr3 as $key => $value) {
    $descriptionarr4 = explode('<li',$value);
    if(sizeof($descriptionarr4) > 1) {
      $descriptionarr5 = explode('>',$descriptionarr4[1]);
      array_shift($descriptionarr5);
      $descriptionstring = implode(">",$descriptionarr5);
      if(substr_count($descriptionstring,'<ul') >=1){
        $descriptionarr6 = explode('<ul',$value);
        $descriptionarr7 = explode('<li',$descriptionarr6[1]);
        $descriptionarr5 = explode('>',$descriptionarr7[1]);
        array_shift($descriptionarr5);
        $descriptionstring = implode(">",$descriptionarr5);
      }
      $detailedfeatures = description_function($detailedfeatures,$descriptionstring,$i);
    }
    else{
      //echo "$i Value: ".$value."<br><hr><br>";
    }
    $i = $i + 1;
  }
  $allotherfeatures = $detailedfeatures['allotherfeatures'];
  unset($detailedfeatures['allotherfeatures']);
  $stringcount1 = explode("Style ID",$result);
  $stringcount2 = explode("</span>",$stringcount1[2]);
  $detailedfeatures['product SKU'] = $stringcount2[1];
  echo "<ul>";
  foreach ($detailedfeatures as $key => $value) {
    echo "<li>$key: $value</li>";
  }
  echo "</ul>";
  echo "<br><hr><br>";
  $variations=[];
  print_r($allotherfeatures);
  //$variationsarr1 = explode('class="products-related',$result);
  //$variationsarr2 = explode('class="itempage-footer',$variationsarr1[0]);
  //echo $variationsarr2[0];
  include "makeentry.php";
?>
