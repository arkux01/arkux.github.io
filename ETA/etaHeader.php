<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<head>
	<title>Arkux</title>
	<link rel="shortcut icon" href="Arkux.ico" type="image/x-icon" />
</head>
<body>
<?php

class Stop{
    private $ID;
    private $name;
    public $ETA=[];

    public function __construct($ID){
        //echo "- Start to Constuct Stop - <br>";
        $this->ID=$ID;
        $json = json_decode(file_get_contents("https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/".$ID),TRUE);  
        $this->name = $json["data"]["name_tc"];
        //echo "- Stop ".$ID." (".$this->name.") Processed - <br>";
    }

    public function getID(){
        return $this->ID;
    }

    public function getName(){
        return $this->name;
    }

}

class Route{

    private $routeNum;
    private $dir;
    private $company;
    private $orig;
    private $dest;
    private $stops=[];   //array of Stop


    public function __construct($route, $dir){
        //echo "- Start to Constuct Route - <br>";
        $this->routeNum = $route;
        $this->dir = $dir;
        $routeJson = json_decode(file_get_contents("https://rt.data.gov.hk/v1/transport/citybus-nwfb/route/NWFB/".$route),TRUE);
        if(count($routeJson["data"])){
            $this->company = "NWFB";
        } else {
            unset($routeJson);
            $routeJson = json_decode(file_get_contents("https://rt.data.gov.hk/v1/transport/citybus-nwfb/route/CTB/".$route),TRUE);
            $this->company = "CTB";
        }
        
        //echo "- Company Processed - <br>";

        if($dir=="outbound"){
            $this->orig = $routeJson["data"]["orig_tc"];
            $this->dest = $routeJson["data"]["dest_tc"];
        } else {
            $this->dest = $routeJson["data"]["orig_tc"];
            $this->orig = $routeJson["data"]["dest_tc"];
        }   

        //echo "- Direction Processed - <br>";

        $routeJson = json_decode(
            file_get_contents("https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/".$this->company."/".$route."/".$dir),TRUE);
        foreach($routeJson["data"] as $k){
            $this->stops[] = New Stop($k["stop"]);
        }

        //echo "- Whole route Processed - <br>";
    }

    public function displayStopList(){
        foreach($this->stops as $s){
            echo $s->getName()."<br>";
        }
    }

    public function getTitle(){
        return $this->orig." → ".$this->dest;
    }
    public function getRoute(){
        return $this->routeNum;
    }
    public function getDir(){
        return $this->dir;
    }
    public function getCompany(){
        return $this->company;
    }

}
//echo "- Start of Script - <br>";
$R8P = New Route("682","inbound");
$R8P->displayStopList();
?>

</body></html>