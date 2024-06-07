<?php
$allowed_origins = ["http://localhost:3000", "https://example.com"]; error_log("HTTP_ORIGIN: " . $_SERVER['HTTP_ORIGIN']); // Log origin for debugging
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) { header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']); } else { header("Access-Control-Allow-Origin: *"); } header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); header("Access-Control-Allow-Headers: Content-Type, Authorization, token"); header("Access-Control-Allow-Credentials: true"); if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; } // Log other headers
 error_log("HEADERS: " . print_r(getallheaders(), true));










?>