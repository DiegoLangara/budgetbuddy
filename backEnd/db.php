<?php
//local
$con = mysqli_connect("localhost","root","","budgetbuddy");
//live
//$con = mysqli_connect("localhost","intelig1_bb","Langara123!","intelig1_bb");
if (!$con) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>
