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
      //echo "Home%#120#%";
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
                  $count2 = substr_count(strtolower($str),$checks2[$i-1]);
                  if($count2 > 0) {
                    $string2 = strtolower($str);
                    $string5 = $string2;
                    $str2 = "";
                    for($j = 0; $j < $count2; $j++) {
                      $arr21 = explode($checks2[$i-1],$string2);
                      $pos2 = stripos($string5,$checks2[$i-1]);
                      $string5 = substr($string5,$pos2+1);
                      $lastchr = substr($arr21[$j], -1);
                      $space_pos1 = strripos($arr21[$j]," ");
                      if($lastchr == "") {
                        echo "first<br>";
                        $nextchar = $string2[$pos2+strlen($checks2[$i-1])];
                        if($nextchar == "") {
                          echo "last<br>";
                        }
                        elseif ($nextchar == " " || $nextchar == "." || $nextchar == "," || $nextchar == "\n" || $nextchar == "\r") {
                          if (array_key_exists($checks2[$i-1],$arr)) {
                            if(array_key_exists($file, $arr[$checks2[$i-1]])) {
                              $arr22 = $arr[$checks2[$i-1]];
                              if(array_key_exists($linenum,$arr22[$file])) {
                                $arr23 = $arr22[$file];
                                $arr23[$linenum] = $arr23[$linenum] + 1;
                                $arr22[$file] = $arr23;
                                $arr[$checks2[$i-1]] = $arr22;
                              }
                              else {
                                $arr23 = $arr22[$file];
                                $arr23[$linenum] = 1;
                                $arr22[$file] = $arr23;
                                $arr[$checks2[$i-1]] = $arr22;
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
                      }
                      elseif ($lastchr == " ") {
                        $nextchar = $string2[$pos2+strlen($checks2[$i-1])];
                        if($nextchar == "") {
                          echo "last2<br>";
                        }
                        elseif ($nextchar == " " || $nextchar == "." || $nextchar == "," || $nextchar == "\n" || $nextchar == "\r") {
                          if (array_key_exists($checks2[$i-1],$arr)) {
                            if(array_key_exists($file, $arr[$checks2[$i-1]])) {
                              $arr22 = $arr[$checks2[$i-1]];
                              if(array_key_exists($linenum,$arr22[$file])) {
                                $arr23 = $arr22[$file];
                                $arr23[$linenum] = $arr23[$linenum] + 1;
                                $arr22[$file] = $arr23;
                                $arr[$checks2[$i-1]] = $arr22;
                              }
                              else {
                                $arr23 = $arr22[$file];
                                $arr23[$linenum] = 1;
                                $arr22[$file] = $arr23;
                                $arr[$checks2[$i-1]] = $arr22;
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
                          echo "pos2 = $pos2 <br> arr[j] = ".$arr21[$j]."<br>";
                          $p = 0;
                          $sum = 0;
                          while($p < sizeof($arr21) && $p < $j) {
                            print_r($arr21[$p]);
                            echo "<br>line<br>";
                            if($arr21[$p] == "" || $arr21[$p] == "\r" || $arr21[$p] == "\n") {
                              //echo "newface<br>";
                            }
                            else {
                              $sum += strlen($arr21[$p]);
                            }
                            $p++;
                          }
                          //echo "$file = third case 1, ".($nextchar)."<br> $string2, ".$checks2[$i-1]."<br>$sum, $pos2<br>";
                          $nextstr = stripos($string2," ",($sum));
                          echo "NEXTSTR=$nextstr<br>sum=$sum<br>";
                          if($nextstr > ($sum+1)) {
                            $string4 = substr($string2,$sum,$nextstr-$sum);
                          } else {
                            $string4 = "";
                          }
                          //echo "string4 = $string4 <br>";
                          if($j > 0) {
                            $pos3 = strripos($arr21[$j-1]," ");
                            //echo "$pos3<br>".strlen($arr21[$j-1])."<br>".$arr21[$j-1]."<br>";
                            if($pos3 != "" && ($pos3+1) < strlen($arr21[$j-1])) {
                              echo "in pos3 place<br>";
                              $string4 = substr($arr21[$j-1],$pos3).$string4;
                            }
                          }
                          echo "$string2 <br> str4 =  $string4<br>";
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
                    }
                  }
                }
              }
              //arsort($main_arr[$file], 1);
              fclose($myfile);
          }
          $main_arr = $arr;
          //print_r($main_arr);
          foreach ($main_arr as $key => $value) {
            echo "$key => ";
            print_r($value);
            echo "<br>";
          }
          echo "<br>";
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
  }
}
$spreadSheet->disconnectworkSheets();
unset($spreadSheet);
?>
