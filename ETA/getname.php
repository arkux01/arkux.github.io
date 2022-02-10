<?php

function getCompany($route){        //:Company
    $url = "https://rt.data.gov.hk/v1/transport/citybus-nwfb/route/NWFB/".$route;
    $json = json_decode(file_get_contents($url),TRUE);
    if(count($json["data"])==0) return "CTB";
    else return "NWFB";
}

$route = strtoupper($_GET["route"]);
$company = getCompany($route);
$dir = $_GET["dir"];

echo "<table border='1'>";
$list = [];
$json = json_decode(file_get_contents("https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/".$company."/".$route."/".$dir),TRUE);
for($i = 0; $i < count($json["data"]); $i++){
    $list[$i] = $json["data"][$i]["stop"];
    $stop = json_decode(file_get_contents("https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/".$list[$i]),TRUE);
    echo "<tr><td>".$list[$i]."</td><td>".$stop["data"]["name_tc"]."</td></tr>";
} 
echo "</table>";

