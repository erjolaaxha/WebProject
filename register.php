<?php
session_start();

/* ================================
   1. PRANO VETËM POST
================================ */
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: register.html");
    exit;
}

/* ================================
   2. DB CONNECTION
================================ */
$serverName = "DESKTOP-SCU8G2F";

$connectionOptions = [
    "Database" => "ELITEGYM",
    "Uid"      => "sa",
    "PWD"      => "jolajola14"
];

$conn = sqlsrv_connect($serverName, $connectionOptions);

if (!$conn) {
    die("Gabim lidhje DB: " . print_r(sqlsrv_errors(), true));
}

/* ================================
   3. INPUT (nga HTML yt)
================================ */
$emri       = trim($_POST["emri"] ?? "");
$mbiemri    = trim($_POST["mbiemri"] ?? "");
$datelindja = trim($_POST["datelindja"] ?? "");
$gjinia     = trim($_POST["gjinia"] ?? "");
$email      = trim($_POST["email"] ?? "");
$nrtelefoni = trim($_POST["phone"] ?? "");
$rruga      = trim($_POST["rruga"] ?? "");
$qyteti     = trim($_POST["qyteti"] ?? "");
$password   = $_POST["password"] ?? "";
$password2  = $_POST["confirmPassword"] ?? "";
$package    = trim($_POST["package"] ?? "");

/* ================================
   4. PACKAGES
================================ */
$cmimet = [
    "Start - 1 Muaj"  => ["cmimi" => 29,  "muaj" => 1],
    "Klasik - 3 Muaj" => ["cmimi" => 75,  "muaj" => 3],
    "Pro - 6 Muaj"    => ["cmimi" => 130, "muaj" => 6],
    "Elite - 1 Vit"   => ["cmimi" => 220, "muaj" => 12],
];

/* ================================
   5. VALIDATION
================================ */
if (
    !$emri || !$mbiemri || !$datelindja || !$gjinia ||
    !$email || !$nrtelefoni || !$package ||
    !$rruga || !$qyteti
) {
    header("Location: register.html?error=Plotesoni+te+gjitha+fushat");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: register.html?error=Email+i+pavlefshem");
    exit;
}

if (strlen($password) < 8) {
    header("Location: register.html?error=Fjalekalimi+minimum+8+karaktere");
    exit;
}

if ($password !== $password2) {
    header("Location: register.html?error=Fjalekalimet+nuk+perputhen");
    exit;
}

if (!isset($cmimet[$package])) {
    header("Location: register.html?error=Paketa+e+pavlefshme");
    exit;
}

/* ================================
   6. CHECK EMAIL
================================ */
$sqlCheck = "SELECT COUNT(*) AS total FROM ANETAR WHERE Email = ?";

$stmtCheck = sqlsrv_query($conn, $sqlCheck, [$email]);

if ($stmtCheck === false) {
    die(print_r(sqlsrv_errors(), true));
}

$row = sqlsrv_fetch_array($stmtCheck, SQLSRV_FETCH_ASSOC);

if ($row["total"] > 0) {
    header("Location: register.html?error=Email+ekziston");
    exit;
}

/* ================================
   7. INSERT ANETAR
================================ */
$sql = "INSERT INTO ANETAR
(
    Emri,
    Mbiemri,
    Datelindja,
    Gjinia,
    Email,
    NrTelefoni,
    Rruga,
    Qyteti
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$params = [
    $emri,
    $mbiemri,
    $datelindja,
    $gjinia,
    $email,
    $nrtelefoni,
    $rruga,
    $qyteti
];

$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}

/* ================================
   8. MERR ID E USERIT
================================ */
$sqlId = "SELECT TOP 1 AnetarID 
          FROM ANETAR 
          WHERE Email = ?
          ORDER BY AnetarID DESC";

$stmtId = sqlsrv_query($conn, $sqlId, [$email]);

if ($stmtId === false) {
    die(print_r(sqlsrv_errors(), true));
}

$rowId = sqlsrv_fetch_array($stmtId, SQLSRV_FETCH_ASSOC);

$anetarID = $rowId["AnetarID"];

/* ================================
   9. INSERT ABONIM
================================ */
$info = $cmimet[$package];

$dataFillimit = date("Y-m-d");
$dataMbarimit = date("Y-m-d", strtotime("+{$info['muaj']} months"));

$sqlAb = "INSERT INTO ABONIM
(
    AnetarID,
    Tipi,
    Cmimi,
    DataFillimit,
    DataMbarimit,
    Statusi
)
VALUES (?, ?, ?, ?, ?, ?)";

$paramsAb = [
    $anetarID,
    $package,
    $info["cmimi"],
    $dataFillimit,
    $dataMbarimit,
    "Aktiv"
];

$stmtAb = sqlsrv_query($conn, $sqlAb, $paramsAb);

if ($stmtAb === false) {
    die(print_r(sqlsrv_errors(), true));
}

/* ================================
   10. SESSION
================================ */
$_SESSION["anetar_id"] = $anetarID;
$_SESSION["emri"]      = $emri;
$_SESSION["email"]     = $email;

/* ================================
   11. FINAL REDIRECT
================================ */
header("Location: dashboard.html");
exit;
?>