<?php
  $allotherfeatures = [];
  $arr1 = explode('<h1 class="a-text f-title">Product details</h1>',$result);
  $arr2 = explode('</p>',$arr1[1]);
  $arr3 = explode('<p',$arr2[0]);
  $arr4 = explode('>',$arr3[1]);
  array_shift($arr4);
  $stringtry1 = implode(">",$arr4);
  $arr5 = explode("<br />",$stringtry1);
  $i = 0;
  $detailedfeatures = [];
  foreach ($arr5 as $key => $value) {
    $liststring2 = $arr5[$i];
    array_push($allotherfeatures,$liststring2);
    $lowerliststring2 = strtolower($liststring2);
    $stringcount1 = substr_count($lowerliststring2,'lining');
    if($stringcount1 >= 1) {
      $text = str_ireplace(">","",$liststring2);
      $text = str_ireplace("<","",$text);
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
              $detailedfeatures['strap measurement'] = $text[0];
            }
            else{
              $stringcount1 = substr_count($lowerliststring2,"inches");
              $stringcount2 = substr_count($lowerliststring2,"inch");
              $stringcount3 = substr_count($lowerliststring2,"in ");
              $flag1 = 0;
              if(($stringcount1 == 1 || $stringcount2 == 1 || $stringcount3 == 1)) {
                if($stringcount3 == 1) {
                  $stringcount4 = substr_count($lowerliststring2,"cm");
                  if($stringcount4 == 1){
                    $text = str_ireplace("(","",$lowerliststring2);
                    $text = str_ireplace(")","",$text);
                    $trialtext = str_ireplace("x","",$text);
                    $trialtext = str_ireplace("X","",$trialtext);
                    $trialtext = str_ireplace("in","",$trialtext);
                    $trialtext = str_ireplace("cm","",$trialtext);
                    $trialtext = str_ireplace(" ",",",$trialtext);
                    $trialarr = explode(",",$trialtext);
                    //print_r($trialarr);
                    $flag2 = 0;
                    foreach ($trialarr as $key => $value) {
                      if($value != ""){
                        $try1 = (int)$value;
                        if($try1 == 0){
                          $flag2 = 1;
                        }
                        //echo $key." ".$value." ".$try1.",";
                      }
                    }
                    $sizearr = explode(" ",$text);
                    $sizestr = "";
                    if($flag2 == 0) {
                      $flag1 = 1;
                      foreach($sizearr as $key => $value) {
                        if($value == 'in') {
                          $detailedfeatures['length in inches'] = $sizestr.$value;
                          $sizestr = "";
                        }
                        else if($value == "cm") {
                          $detailedfeatures['length in cm'] = $sizestr.$value;
                          $sizestr = "";
                        }
                        else{
                          $sizestr .= $value;
                        }
                      }
                    }
                  }
                }
                else {
                  $flag1 = 1;
                  $detailedfeatures['length in inches'] = $liststring2;
                }
              }
              if($flag1 == 0){
                $stringcount1 = substr_count($lowerliststring2,"carry");
                $stringcount2 = substr_count($lowerliststring2,"body");
                if($stringcount1 >= 1 || $stringcount2 >= 1) {
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
                      $stringcount1 = substr_count($lowerliststring2,"handles");
                      $stringcount2 = substr_count($lowerliststring2,"handle");
                      if($stringcount1 >= 1 || $stringcount2 >= 1) {
                          $detailedfeatures['handle'] = $liststring2;
                      }
                      else {
                        $stringcount1 = substr_count($lowerliststring2,"reference : ");
                        if($stringcount1 >= 1) {
                          $detailedfeatures['product SKU'] = trim(explode(':',$liststring2)[1]);
                        }
                        else {
                          if($i == 1) {
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
    $i++;
  }
  echo "<ul>";
  foreach ($detailedfeatures as $key => $value) {
    echo "<li>$key: $value</li>";
  }
  echo "</ul><br><br><hr>";
  $imgarr1 = explode('class="o-product__imgs',$result);
  $imgarr2 = explode('</ul>',$imgarr1[1]);
  $imgarr3 = explode('<img',$imgarr2[0]);
  $mainimagearr = [];
  foreach ($imgarr3 as $key => $value) {
    if(substr_count($value,'data-interchange=')) {
      $imgarr4 = explode('data-interchange="',$value);
      $imgarr5 = explode('"',$imgarr4[1]);
      $imgarr6 = explode('[',$imgarr5[0]);
      $imgarr7 = explode(',',$imgarr6[sizeof($imgarr6) - 1]);
      if(substr_count($imgarr7[0],"celine")){
        if(!(in_array($imgarr7[0],$mainimagearr))){
          array_push($mainimagearr,$imgarr7[0]);
          echo "<div style='display: inline;'><img onerror='removeimage(this)' src='".$imgarr7[0]."' style='height:200px;width:200px;'></div>";
        }
      }
    }
  }
  $productdata = [];
  $productdataarr1 = explode('class="a-text f-title o-product__title"',$result);
  foreach ($productdataarr1 as $key => $value) {
    if(substr_count($value,'data-gtm-en-product-name')){
      $productdataarr2 = explode('data-gtm-en-product-name="',$value);
      $productdataarr3 = explode('"',$productdataarr2[1]);
      $productdata['name'] = $productdataarr3[0];
    }
    if(substr_count($value,'data-gtm-product-sales-price')){
      $productdataarr2 = explode('data-gtm-product-sales-price="',$value);
      $productdataarr3 = explode('"',$productdataarr2[1]);
      $productdata['sale price'] = $productdataarr3[0];
    }
    if(substr_count($value,'data-gtm-product-standard-price')){
      $productdataarr2 = explode('data-gtm-product-standard-price="',$value);
      $productdataarr3 = explode('"',$productdataarr2[1]);
      $productdata['standard price'] = $productdataarr3[0];
    }
  }
  echo "<br><br><hr>";
  echo "<ul>";
  foreach ($productdata as $key => $value) {
    echo "<li>$key: $value</li>";
  }
  echo "</ul><br><br><hr>";
  $feildsarr1 = explode('class="o-form__fieldset"',$result);
  $feildsarr2 = explode('class="a11y"',$feildsarr1[1]);
  $feildsarr3 = explode('class="m-form-dd__header f-body', $feildsarr2[0]);
  $variations = [];
  //echo sizeof($feildsarr3);
  //print_r($feildsarr3);
  $flag = 0;
  for($i = 0; $i < sizeof($feildsarr3)-1; $i++) {
    if($flag == 0){
      $i = 1;
      $flag = 1;
    }
    $varhead = explode('</p>',$feildsarr3[$i]);
    $varhead = explode('>',$varhead[0]);
    $variations[$varhead[sizeof($varhead) - 1]] = [];
    //echo "variations:";print_r($variations);
    $variationsarr1 = explode('class="m-form-dd__items"',$feildsarr3[$i]);
    if(sizeof($variationsarr1) > 1) {
      $variationsarr2 = explode('</a>',$feildsarr3[$i]);
      $k = 0;
      foreach($variationsarr2 as $key => $value) {
        $datavalue = explode('</span>',$value);
        if(!in_array($datavalue[sizeof($datavalue)-1],$variations[$varhead[sizeof($varhead)-1]]) && sizeof($datavalue) > 1) {
          //echo "data: ";print_r($datavalue);echo"<br>";
          $data1 = explode('src="',$datavalue[sizeof($datavalue)-2]);
          $data2 = explode('"',$data1[sizeof($data1)-1]);
          $subarray1 = [];
          $subarray1['id'] = $k;
          $subarray1['name'] = $datavalue[sizeof($datavalue)-1];
          $subarray1['img'] = "https://www.celine.com".$data2[0];
          array_push($variations[$varhead[sizeof($varhead)-1]],$subarray1);
          $k++;
        }
      }
    }
  }
  //echo "<br><br><hr>";
  echo "variations: <br>";
  echo "<ul>";
  foreach ($variations as $key => $value) {
    echo "<li>$key => <ol>";
    foreach ($value as $key1 => $value1) {
      echo "<li>";
      print_r($value1);
      echo "</li>";
    }
    echo "</ol></li>";
  }
  echo "</ul><br><br><hr>";
  print_r($allotherfeatures);
  include 'makeentry.php';
?>
