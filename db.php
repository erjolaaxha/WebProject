<?php

$serverName = "DESKTOP-SCU8G2F";

$connectionOptions = array(
    "Database" => "ELITEGYM",
    "Uid" => "sa",
    "PWD" => "jolajola14"
);

$conn = sqlsrv_connect($serverName, $connectionOptions);

if($conn == false){

    die(print_r(sqlsrv_errors(), true));

}else{

    echo "Connected Successfully";

}

?>