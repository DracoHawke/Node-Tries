<?php
  //Database connection and const file
  define('base_url', 'http://localhost/curlapp1/');
  //define('admin_url', 'http://localhost/newreality/administrator');
  $hostname = 'localhost';
  $username = 'root';
  $password = '';
  $database ='scrapper';

  $conn = new mysqli($hostname, $username, $password, $database);

  if ($conn->connect_error) {
      die('Connect Error, '. $conn->connect_errno . ': ' . $conn->connect_error);
  }
  //mysqli_set_charset($conn,"utf8mb4");
  //@session_start();
  $error = '';
  $row = '';
  $success = '';
?>
