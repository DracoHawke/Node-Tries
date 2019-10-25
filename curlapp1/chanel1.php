
<?php
	header("Access-Control-Allow-Origin: *");
  $curl_handle=curl_init();
  curl_setopt($curl_handle,CURLOPT_URL,'https://www.chanel.com/en_AU/fashion/p/hdb/a67085y09953/a67085y0995394305/small-boy-chanel-handbag-calfskin-rutheniumfinish-metal-black.html');
  curl_setopt($curl_handle, CURLOPT_BINARYTRANSFER, true);
  curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,1);
  curl_setopt($curl_handle, CURLOPT_SSL_VERIFYHOST, 0);
  $buffer = curl_exec($curl_handle);
  curl_close($curl_handle);
  $list = array();
	echo $buffer;
  $body = explode('fs-productsheet__main',$buffer);
  $body = $body[1];
  function get_string_between($string, $start, $end){
		$string = ' ' . $string;
		$ini = strpos($string, $start);
		if ($ini == 0) return '';
		$ini += strlen($start);
		$len = strpos($string, $end, $ini) - $ini;
		return substr($string, $ini, $len);
  }

  $parsed = get_string_between($body, 'fs-productsheet__pictures">', '</ul>');
  //echo $count = substr_count($parsed, '<li');
  $lirow = explode('</li>',$parsed);
  $images = array();
  for($i=0;$i<count($lirow)-1;$i++){
	  $images[] = get_string_between($lirow[$i], 'data-src="', '" ');
  }
  $list['images'] = $images;

  echo $parsed1 = get_string_between($body, 'fs-productsheet__details-content">', '<div class="fs-productsheet__storeLocator');

  $title = get_string_between($parsed1, 'fs-productsheet__title">', '</span>');

  $list['title'] = $title;

  echo "<pre>";
  print_r($list);
  echo "</pre>";


?>
<!--<link rel="modulepreload" href="//www.chanel.com/asset/frontstage/js/front.069a1da967306c36aa1d.js" as="script">
-->
