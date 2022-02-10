<?php




class Stop {
    protected $nameCh;
    protected $nameEn;
    protected $id;

}

class Time{
    protected $timeNo;
    protected $timeDisplay;


}

class DirRoute {
    protected $routeNo; // string
    protected $routeType; // 
    protected $dep; // Stop
    protected $arr; // Stop
    protected $dir;
    protected $company;
}

class ETAstop {
    protected $route; // DirRoute
    protected $stop; // Stop
    protected $times; // Time
    
    public function acquireTime(){
        
    }
}


class ETAtable {

}

?>