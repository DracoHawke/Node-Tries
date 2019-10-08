<?php
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
$spreadSheet = new Spreadsheet();
//$writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadSheet, "Xlsx");

if($_SERVER["REQUEST_METHOD"]=="POST"){
  if($_POST['action'] == 'call_this' and isset($_POST['word'])) {
    $path = "./Files Dump/Input/";
    $main_arr = [];
    function myfunction($key,$value,$file,$arary) {
      $value_main = $arary;
      if(is_array($value)){
        $value2 = array_sum($value);
      }
      else {
        $value2 = $value;
      }
      $arr[$key] = $value2;
      $value_main = array_merge($value_main,$arr);
      $arary = $value_main;
      return $arary;
    }
    if(trim($_POST['word']) == "") {
      if ($handle = opendir($path)) {
          //echo "in";
          $bow = [];
          $i = 0;
          while (false !== ($file = readdir($handle))) {
              if ('.' === $file) continue;
              if ('..' === $file) continue;
              //var_dump($file);
              //echo "<br>";
              $myfile = fopen($path."/".$file, "r") or die("Unable to open file!");
              $arr = [];
              while(!feof($myfile)) {
                $str = fgets($myfile);
                $words = array_count_values(str_word_count($str, 1));
                $arr = array_merge_recursive($arr,$words);
              }
              $main_arr[$file] = [];
              foreach ($arr as $key => $value) {
                $main_arr[$file] = myfunction($key,$value,$file,$main_arr[$file]);
              }
              arsort($main_arr[$file], 1);
              fclose($myfile);
          }
          $keys_arr = [];
          $values_arr = [];
          $i = 0;
          foreach ($main_arr as $key => $data) {
            // Add new sheet
            $spreadSheet->setActiveSheetIndex($i);
            $spreadSheet->createSheet(); //Setting index when creating
            $workSheet = $spreadSheet->getActiveSheet();
            $j = 0;
            foreach($data as $key1 => $data1) {
              if (array_key_exists($key1,$keys_arr)) {
                $keys_arr[$key1] = $keys_arr[$key1] + $data1;
              }
              else {
                $keys_arr[$key1] = $data1;
              }
              //echo $j.", ";
              $workSheet->setCellValue('A'.$j,$key1);
              $workSheet->setCellValue('B'.$j, $data1);
              $j++;
            }
            //echo "<br>";
            // Rename sheet
            $workSheet->setTitle("$key");
            $i++;
          }
          $writer = new Xlsx($spreadSheet);
          $writer->save("Files Dump/Output/file2.xlsx");
          $link = "";
          $link = $link."Seperate%#120#%Files Dump/Output/file2.xlsx";
          arsort($keys_arr, 1);
          //print_r($keys_arr);
          $spreadSheet2 = new Spreadsheet();
          $workSheet2 = $spreadSheet2->getActiveSheet();
          $iter = 1;
          foreach($keys_arr as $keys => $data) {
            $workSheet2->setCellValue('A'.$iter,$keys);
            $workSheet2->setCellValue('B'.$iter,$data);
            $iter++;
          }
          $workSheet2->setTitle("Global");
          $writer = new Xlsx($spreadSheet2);
          $writer -> save("Files Dump/Output/Global.xlsx");
          $link = $link."%#120#%Global%#120#%Files Dump/Output/Global.xlsx";
          echo($link);
      }
    }
    else if($_POST['word'] != "") {
      if ($handle = opendir($path)) {
        $checks2 = explode(" ",strtolower(trim($_POST['word'])));
        if(sizeof($checks2) > 1) {
          array_push($checks2,strtolower(trim($_POST['word'])));
        }
        print_r($checks2);
        echo sizeof($checks2)."<br>";
        $bow = [];
        $arr = [];
        while (false !== ($file = readdir($handle))) {
          if ('.' === $file) continue;
          if ('..' === $file) continue;
          $myfile = fopen($path."/".$file, "r") or die("Unable to open file!");
          $lineno = 0;
          while(!feof($myfile)) {
            $lineno++;
            $linenum = "linenum".$lineno;
            $str = fgets($myfile);
            for($i = sizeof($checks2); $i > 0; $i--) {
              $count1 = substr_count(strtolower($checks2[$i-1])," ");
              $count2 = substr_count(strtolower($str),$checks2[$i-1]);
              if($count2 > 0 && $count1 == 0) {
                $string2 = strtolower($str);
                $arr21 = explode(" ",$string2);
                for($j = 0; $j < sizeof($arr21); $j++) {
                  if(trim($arr21[$j]) == trim($checks2[$i-1])) {
                    echo "$file 1st ".$checks2[$i-1]."<br>";
                    if($linenum == "linenum1"){
                      echo "lineno1<br>";
                    }
                    if (array_key_exists($checks2[$i-1],$arr)) {
                      if(array_key_exists($file, $arr[$checks2[$i-1]])) {
                        if(array_key_exists($linenum,$arr[$checks2[$i-1]][$file])) {
                          $arr[$checks2[$i-1]][$file][$linenum] = $arr[$checks2[$i-1]][$file][$linenum] + 1;
                        }
                        else {
                          $arr[$checks2[$i-1]][$file][$linenum] = 1;
                        }
                      }
                      else {
                        $arr[$checks2[$i-1]][$file][$linenum] = 1;
                      }
                    }
                    else {
                      $arr[$checks2[$i-1]][$file][$linenum] = 1;
                    }
                  }
                  else {
                    $count3 = substr_count($arr21[$j],$checks2[$i-1]);
                    if($count3 > 0) {
                      echo "$file 2nd ".$arr21[$j].",".$checks2[$i-1]." <br>";
                      if(trim($arr21[$j]) == trim($checks2[$i-1])) {
                        echo "same<br>";
                      }
                      $arr21[$j] == trim($arr21[$j]);
                      if (array_key_exists($arr21[$j],$arr)) {
                        if(array_key_exists($file, $arr[$arr21[$j]])) {
                          if(array_key_exists($linenum,$arr[$arr21[$j]][$file])) {
                            $arr[$arr21[$j]][$file][$linenum] = $arr[$arr21[$j]][$file][$linenum] + 1;
                          }
                          else {
                            $arr[$arr21[$j]][$file][$linenum] = 1;
                          }
                        }
                        else {
                          $arr[$arr21[$j]][$file][$linenum] = 1;
                        }
                      }
                      else {
                        $arr[$arr21[$j]][$file][$linenum] = 1;
                      }
                    }
                  }
                }
              }
              else {
                echo $count2." = $file<br>";
                $string2 = strtolower($str);
                $string5 = $string2;
                $str2 = "";
                for($j = 0; $j < $count2; $j++) {
                  $arr21 = explode($checks2[$i-1],$string2);
                  $lastchr = substr($arr21[$j], -1);
                  $space_pos1 = strripos($arr21[$j]," ");
                  echo "str = $str ,arr[j] = ".$arr21[$j]." , lastchar = $lastchr , code = ".ord($lastchr).", spacepos = $space_pos1<br>";
                  if($lastchr == "" || $lastchr == " ") {
                    $k = 0;
                    $sum1 = 0;
                    while($k < sizeof($arr21) && $k <= $j) {
                      if($arr21[$k] == "" || $arr21[$k] == "\r" || $arr21[$k] == "\n") {}
                      else {
                        $sum1 += strlen($arr21[$k]);
                      }
                      $k++;
                    }
                    $nextchar = $string2[$sum1+strlen($checks2[$i-1])];
                    if($nextchar == "i") {
                      echo "array => ";
                      print_r($arr21);
                      echo "<br>";
                    }
                    $nextword = substr($string2,$sum1+strlen($checks2[$i-1]),strlen($checks2[$i-1])+1);
                    $nextword = trim($nextword);
                    preg_replace("/\!|\.|\:|\;|\,/","", $nextword);
                    echo "nextword = $nextword ";
                    echo "nextchr = $nextchar<br>";
                    if ($nextchar == "" || $nextchar == " " || $nextchar == "." || $nextchar == "," || $nextchar == "\n" || $nextchar == "\r" || $nextword == $checks2[$i-1]) {
                      echo "enter checks2<br>";
                      if (array_key_exists($checks2[$i-1],$arr)) {
                        if(array_key_exists($file, $arr[$checks2[$i-1]])) {
                          if(array_key_exists($linenum,$arr[$checks2[$i-1]][$file])) {
                            $arr[$checks2[$i-1]][$file][$linenum] = $arr[$checks2[$i-1]][$file][$linenum] + 1;
                          }
                          else {
                            $arr[$checks2[$i-1]][$file][$linenum] = 1;
                          }
                        }
                        else {
                          $arr[$checks2[$i-1]][$file][$linenum] = 1;
                        }
                      }
                      else {
                        $arr[$checks2[$i-1]][$file][$linenum] = 1;
                      }
                    }
                    else {
                      echo "checks2 = ".$checks2[$i-1].", nextchar = $nextchar<br>";
                      $nextstr = stripos($string2," ",($sum1));
                      echo "string2 = $string2 <br>";
                      echo "NEXTSTR=$nextstr<br>nextstrvalue=".ord($string2[$nextstr])."<br>sum=$sum1<br>sumvalue=".substr($string2,$sum1)."<br>";
                      if($nextstr > ($sum1+1)) {
                        $string4 = substr($string2,$sum1,$nextstr-$sum1);
                      } else {
                        $string4 = "";
                      }
                      echo "string4 = $string4 <br>";
                      if($j > 0) {
                        $pos3 = strripos($arr21[$j-1]," ");
                        //echo "$pos3<br>".strlen($arr21[$j-1])."<br>".$arr21[$j-1]."<br>";
                        if($pos3 != "" && ($pos3+1) < strlen($arr21[$j-1])) {
                          echo "in pos3 place<br>";
                          $string4 = substr($arr21[$j-1],$pos3).$string4;
                        }
                      }
                      echo "str4 =  $string4<br>";
                      if (array_key_exists($string4,$arr)) {
                        if(array_key_exists($file, $arr[$string4])) {
                          $arr22 = $arr[$string4];
                          if(array_key_exists($linenum,$arr22[$file])) {
                            $arr23 = $arr22[$file];
                            $arr23[$linenum] = $arr23[$linenum] + 1;
                            $arr22[$file] = $arr23;
                            $arr[$string4] = $arr22;
                          }
                          else {
                            $arr23 = $arr22[$file];
                            $arr23[$linenum] = 1;
                            $arr22[$file] = $arr23;
                            $arr[$string4] = $arr22;
                          }
                        }
                        else {
                          $arr[$string4][$file][$linenum] = 1;
                        }
                      }
                      else {
                        $arr[$string4][$file][$linenum] = 1;
                      }
                    }
                  }
                  else {
                    echo "lastchar = $lastchr<br>";

                  }
                }
                echo "<br>line<br>";
              }
            }
          }
          fclose($myfile);
        }
        foreach ($arr as $key => $value) {
          echo "$key => ";
          print_r($value);
          echo "<br>";
        }
        $main_arr = $arr;
        $keys_arr = [];
        $values_arr = [];
        $spreadSheet->setActiveSheetIndex(0);
        $spreadSheet->createSheet(); //Setting index when creating
        $workSheet = $spreadSheet->getActiveSheet();
        $j = 0;
        foreach($main_arr as $key1 => $data1) {
          foreach($data1 as $key2 => $data2) {
            arsort($data2,1);
            foreach($data2 as $key3 => $data3) {
              $workSheet -> setCellValue('A'.$j, $key1);
              $workSheet -> setCellValue('B'.$j, $key2);
              $workSheet -> setCellValue('C'.$j, "line number: ".substr($key3,-1));
              if($j != 0){
                $workSheet -> getCellByColumnAndRow(3,($j)) -> getHyperlink() -> setUrl('./Files%20Dump/Input/'.$key2);
              }
              $workSheet -> setCellValue('D'.$j, $data3);
              $j++;
            }
          }
          //$j++;
        }
        // Rename sheet
        $workSheet -> setTitle("Final Results");
        $i++;
        $writer = new Xlsx($spreadSheet);
        $writer -> save("Files Dump/Output/Active_Results.xlsx");
        $link = "";
        $link = $link."Active Results%#120#%Files Dump/Output/Active_Results.xlsx";
        echo($link);
      }
    }
  }
}
$spreadSheet->disconnectworkSheets();
unset($spreadSheet);
?>
