<?php
  $allotherfeatures = [];
  $detailedfeatures = [];
  $arr1 = explode('id="product-details"',$result);
  $productidarr1 = explode('class="style-number-title">',$arr1[1]);
  $productidarr2 = explode('class="product-detail"',$productidarr1[1]);
  $productidarr3 = explode('</div>',$productidarr2[0]);
  $productid = $productidarr3[0];
  //echo "<br>Product SKU?: <b>".$productid."</b><br><br><hr>";
  $detailedfeatures['product sku'] = $productid;
  $productdetailarr1 = explode('</div>',$productidarr2[1]);
  //echo $productdetailarr1[0];
  $productdetailarr2 = explode('</p>',$productdetailarr1[0]);
  $productdescription = explode('<p>',$productdetailarr2[0]);
  $productdescription = $productdescription[1];
  //echo "<br>Product Description: <b>".$productdescription."</b><br><br><hr>";
  $detailedfeatures['description'] = $productdescription;
  $productdetailarr3 = explode('</ul>',$productdetailarr2[1]);
  $productdetailarr4 = explode('<li>',$productdetailarr3[0]);
  for($i = 1; $i < sizeof($productdetailarr4); $i++) {
    $productdetailarr5 = explode('</li>',$productdetailarr4[$i]);
    $liststring2 = $productdetailarr5[0];
    array_push($allotherfeatures,$liststring2);
    $lowerliststring2 = strtolower($liststring2);
    $stringcount1 = substr_count($lowerliststring2,'lining');
    if($stringcount1 >= 1) {
      $text = str_ireplace("lining","",$liststring2);
      $detailedfeatures['lining'] = $text;
    }
    else {
      $stringcount1 = substr_count($lowerliststring2,'hardware');
      if($stringcount1 >= 1) {
        $text = str_ireplace("hardware","",$liststring2);
        $detailedfeatures['hardware'] = $text;
      }
      else {
        $stringcount1 = substr_count($lowerliststring2,'closure');
        if($stringcount1 >= 1) {
          $detailedfeatures['closure'] = $liststring2;
        }
        else {
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
              //$text = explode('with',$liststring2);
              $detailedfeatures['strap measurement'] = $text;
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
  $productdetails = "<div".$productdetailarr1[0]."</div>";
  $headingarr1 = explode('class="product-info-box',$result);
  $headingarr2 = explode('</h1>',$headingarr1[1]);
  $headingarr3 = explode('<h1',$headingarr2[0]);
  $headingarr4 = explode('>',$headingarr3[1]);
  $heading = $headingarr4[1];
  $detailedfeatures['heading'] = $heading;
  //echo "<br>Product Name: <b>".$heading."</b><br><br><hr>";
  $pricearr1 = explode('class="price-column product-detail-price-column',$headingarr2[1]);
  $pricearr2 = explode('</span>',$pricearr1[1]);
  $pricearr3 = explode('<span',$pricearr2[0]);
  $pricearr4 = explode('>',$pricearr3[1]);
  $price = $pricearr4[1];
  $detailedfeatures['price'] = $price;
  //echo "<br>Price: <b>".$price."</b><br><br><hr>";
  echo "<br>Product Details: <br><ul>";
  foreach ($detailedfeatures as $key => $value) {
    echo "<li>$key: $value</li>";
  }
  echo "</ul><br><br><hr>";
  $imagearr1 = explode('class="product-detail-carousel"',$result);
  $imagearr2 = explode('class="navigation-container"',$imagearr1[1]);
  //echo $imagearr2[0];
  $imagearr3 = explode('class="carousel-inner',$imagearr2[0]);
  //echo $imagearr3[0];
  echo "<br>IMAGES<br>";
  $mainimagearr = [];
  $imagearr4 = explode('class="zoom-carousel-container--item"',$imagearr3[0]);
  for($i = 1; $i < sizeof($imagearr4); $i++) {
    $imagearr5 = explode(' src="',$imagearr4[$i]);
    if(sizeof($imagearr5) > 1){
      $src1 = explode('"',$imagearr5[1]);
      if(sizeof($src1) == 2){
        if(!(in_array($src1[0],$mainimagearr))){
          if(substr_count($src1[0],"http") == 0){
            $src1[0] = "http:".$src1[0];
          }
          array_push($mainimagearr,$src1[0]);
          echo "<div style='display: inline;'><img onerror='removeimage(this)' src='".$src1[0]."' style='height:200px;width:200px;'></div>";
        }
      }
      else if(sizeof($src1) > 2) {
        $srcstring = "";
        for($j = 0; $j < (sizeof($src1)-1); $j++) {
          $srcstring .= $src1[$j];
        }
        if(!(in_array($srcstring,$mainimagearr))) {
          if(substr_count($srcstring,"http") == 0){
            $srcstring = "http:".$srcstring;
          }
          array_push($mainimagearr,$srcstring);
          echo "<div style='display: inline;'><img onerror='removeimage(this)' src='".$srcstring[0]."' style='height:200px;width:200px;'></div>";
        }
      }
    }
  }
  echo "<br><hr><br>";
  $variations = [];
  $variationsarr1 = explode('class="double-image-style-selector-title"',$result);
  $variationsarr2 = explode('</span>',$variationsarr1[sizeof($variationsarr1)-1]);
  $variationsarr3 = explode('>',$variationsarr2[0]);
  $numberofvar = $variationsarr3[sizeof($variationsarr3)-1];
  $numberofvar = str_ireplace('(',"",$numberofvar);
  $numberofvar = str_ireplace(')',"",$numberofvar);
  if((int)$numberofvar > 0){
    //echo "YASSS";
    $numberofvar = (int)$numberofvar;
    $i = 1;
    $variationsarr4 = explode('class="carousel-slide',$variationsarr1[sizeof($variationsarr1)-1]);
    while($i <= $numberofvar) {
      $variationsarr5 = explode('</div>',$variationsarr4[$i]);
      $variationsarr6 = explode('>',$variationsarr5[0]);
      //print_r($variationsarr6);
      //echo "<br>".$variationsarr6[sizeof($variationsarr6)-1]."<br>";
      //echo "<br>".$variationsarr4[$i]."<br>";
      $variations['variations'][$i-1]['id'] = $i-1;
      $variations['variations'][$i-1]['name'] = $variationsarr6[sizeof($variationsarr6)-1];
      $variationsarr5 = explode('srcset="',$variationsarr4[$i]);
      $variationsarr6 = explode('"',$variationsarr5[1]);
      //echo "<img src='".$variationsarr6[0]."'><br>";
      if(substr_count($variationsarr6[0],"http") == 0){
        $variationsarr6[0] = "http:".$variationsarr6[0];
      }
      $variations['variations'][$i-1]['img'] = $variationsarr6[0];
      $i++;
    }
  }
  echo "<br>Variatons:<ul>";
  foreach ($variations as $key => $value) {
    echo "<li><h3>$key</h3></li><ol>";
    if(gettype($value) == 'array'){
      foreach ($value as $key1 => $value1) {
        if(isset($value1['name']) && isset($value1['img'])) {
          echo "<li> Name: ".$value1['name'].",   Image: ".$value1['img']."</li>";
        }
        else {
          echo "<li>";
          print_r($value1);
          echo "</li>";
        }
      }
    }
    else {
      echo "<li>".$value."</li>";
    }
    echo "</ol>";
  }
  echo "</ul><br><br><hr>";
  //print_r($variations);
  require 'makeentry.php';
?>
