<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<head>
	<title>Arkux</title>
	<link rel="shortcut icon" href="Arkux.ico" type="image/x-icon" />
</head>
<body style="background-color:black;color:white;">
    <style>
        .routeNWFB, .routeCTB, .routeAE,.routeCH, .routeWH ,.routeNI {
            padding: 3px 5px;
            font-family: Arial;
            font-size: 300%;
            font-weight: bold;
            text-align: center;
            border: 4px solid;
        }
        .routeNWFB  {color:white;   background-color: #72a; border-color: #72a;}
        .routeCTB   {color:white;   background-color: #048; border-color: #048}
        .routeAE    {color:white;   background-color: #c00; border-color: #c00}
        .routeCH    {color:white;   background-color: red; border-color: red}
        .routeWH    {color:white;   background-color: #094; border-color: #094}
        .routeNI    {color:#ff0;  background-color: #216; border-color: #216}

        .dirNWFB, .dirCTB, .dirAE,.dirCH, .dirWH ,.dirNI {
            padding: 3px 13px;
            font-size: 200%;
            text-align: left;
            font-family: Arial;
            font-weight: bold;
            border: 4px solid;
            background-color:white;
        }
        .dirNWFB  {color: #72a; border-color: #72a;}
        .dirCTB   {color: #048; border-color: #048}
        .dirAE    {color: #c00; border-color: #c00}
        .dirCH    {color: red; border-color: red}
        .dirWH    {color: #084; border-color: #084}
        .dirNI    {color: #216; border-color: #216}

        .stop {
            background-color: #113;           
            padding: 4px 5px;
            font-family: Arial;
            font-size: 150%;
            font-family: 'Times New Roman', Times, serif;
            text-align: right;
            border: 4px solid #000;
            text-decoration: none;
        }
        
        .eta {
            background-color: #113;
            padding: 4px 5px;
            color:#aaf;
            font-family: 'Courier New', Courier, monospace;
            font-size: 150%;
            font-weight: bold;
            text-align: center;
            border: 4px solid #000;
        }


    </style>

    <h2> 新巴城巴指定路線沿線巴士站實時抵站時間一覽（測試版）<br></h2>


<?php
    function getCompany($route){        //:Company
        $url = "https://rt.data.gov.hk/v1/transport/citybus-nwfb/route/NWFB/".$route;
        $json = json_decode(file_get_contents($url),TRUE);
        if(count($json["data"])==0) return "CTB";
        else return "NWFB";
    }

    function getRouteType($route){
        if ($route[0]=='A' || $route[0]=='B') return "AE";
        if ($route[0]=='N') return "NI";
        
        if ($route[0]=='1' || $route[0]=='6' ) {
        
        }
        if ($route[0]=='3') {
        
        }
        if ($route[0]=='9'|| $route[0]=='E') {
        
        }
    }

    function getList($route, $dir, $company){     //:IDs[]
        $list = [];
        $url = "https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/".$company."/".$route."/".$dir;
        $json = json_decode(file_get_contents($url),TRUE);
        for($i = 0; $i < count($json["data"]); $i++){
            $list[$i] = $json["data"][$i]["stop"];
        }        
        return $list;
    }

    function getName($ID){     //:Bus Stop Name
        //$names = [];
        $url = "https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/".$ID;
        $json = json_decode(file_get_contents($url),TRUE);  
        $Tc = $json["data"]["name_tc"];
        if(strpos($Tc, ",")){
            $Tc = substr($Tc, 0, strpos($Tc, ","));
        }
        /*$En = $json["data"]["name_en"];
        if(strpos($En, ",")){
            $En = substr($En, 0, strpos($En, ","));
        }*/
        //$names[$i] = /*[*/$Tc/*,$En]*/;
      
        //return $names;
        return $Tc;

    } 

    function getETA($route, $dir, $company){      //:ETA[][]
        // Obtain the list of involved bus stop IDs
        $url = "https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/".$company."/".$route."/".$dir;
        $json1 = json_decode(file_get_contents($url),TRUE);

        // Filter valid stops at the time
        $dir = ($dir=="outbound")?"O":"I";
        $ETAs = [];
        for($i = count($json1["data"])-1; $i>=0; $i--){
            $url = "https://rt.data.gov.hk/v1/transport/citybus-nwfb/eta/".$company."/".$json1["data"][$i]["stop"]."/".$route;
            $json = json_decode(file_get_contents($url),TRUE);
//            echo "Stop ".$json1["data"][$i]["stop"]." obtained.<br>"; /* Debug Line*/
            if(count($json["data"])){
                $temp = $row = [];
                for($j = 0;$j<count($json["data"]);$j++){
                    if($json["data"][$j]["dir"]==$dir){
                        $temp[count($temp)]=strtotime($json["data"][$j]["eta"]);
//                        echo date("H:i",strtotime($json["data"][$j]["eta"]))." "; /* Debug Line*/
                    }                
                }
                if(!count($temp)){
                    continue;
                }
                if(count($ETAs)){
                    while(isset($ETAs[count($ETAs)-1][count($row)]) && $ETAs[count($ETAs)-1][count($row)+1]<$temp[0]){
                        $row[count($row)]=" ";
                    }
                }

                $ETAs[count($ETAs)] = array_merge([$json1["data"][$i]["stop"]],$row,$temp);
//                echo "ETA of ".$ETAs[count($ETAs)-1][0]." received.<br>"; /* Debug Line*/
            }

        }

        return $ETAs;
    }  

    function getDisplay($route, $dir, $company){  //:dept->dest
        $url = "https://rt.data.gov.hk/v1/transport/citybus-nwfb/route/".$company."/".$route;
        $json = json_decode(file_get_contents($url),TRUE); 
        /*$orig = [$json["data"]["orig_tc"],$json["data"]["orig_en"]];
        $dest = [$json["data"]["dest_tc"],$json["data"]["dest_en"]];
        if($dir=="outbound")
            return [$orig[0]." → ".$dest[0],$orig[1]." → ".$dest[1]];
        else
            return [$dest[0]." → ".$orig[0],$dest[1]." → ".$orig[1]];*/
        if($dir=="outbound")
            return $json["data"]["orig_tc"]." → ".$json["data"]["dest_tc"];
        else
            return $json["data"]["dest_tc"]." → ".$json["data"]["orig_tc"];           
    }

    $route = strtoupper($_GET["route"]);
    $company = getCompany($route);
    $dir = $_GET["dir"];
    $ETAs = getETA($route, $dir, $company);
//    echo "ETA obtained successfully.<br>"; /* Debug Line*/
    ?>

    <table cellspacing="0" align="left">
    <tr><td class="route<?=$company?>"><?=$route?></td><td class="dir<?=$company?>" colspan="10"><?= getDisplay($route, $dir, $company)?></td></tr>

<?php 

    for($i = count($ETAs)-1;$i>=0; $i--){
		echo '<tr><td class="stop">';
		echo getName($ETAs[$i][0])/*[0]*/.'</td>';
        	for ($j=1;$j<count($ETAs[$i]);$j++){
            		echo '<td class="eta">'.date("H:i",$ETAs[$i][$j]).'</td>';
        	}
        	echo "</tr>";
    }
?>
    </table>
</body>
</html>

    
