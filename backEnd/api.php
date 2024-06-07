<?php
require_once 'db.php';

function generateToken() {
    return bin2hex(random_bytes(16));
}

function registerUser($con, $email, $password) {
    // Check if email already exists
    $stmt = $con->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        return ['status' => false, 'message' => 'Email already exists'];
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $con->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hashedPassword);
    if ($stmt->execute()) {
        return ['status' => true, 'message' => 'User registered successfully'];
    } else {
        return ['status' => false, 'message' => 'Registration failed'];
    }
}

function authenticateUser($con, $email, $password) {
    $stmt = $con->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    if ($user && password_verify($password, $user['password'])) {
        $token = generateToken();
        $stmt = $con->prepare("UPDATE users SET token = ?, `last_login` = '".date('Y-m-d h:i:s')."' WHERE user_id = ?");
        $stmt->bind_param("si", $token, $user['user_id']);
        $stmt->execute();
        return ['status' => true, 'message' => 'Authentication successful', 'token' => $token];
    } else {
        return ['status' => false, 'message' => 'Invalid email or password'];
    }
}

function validateToken($con, $user_id, $token) {
    $stmt = $con->prepare("SELECT * FROM users WHERE user_id = ? AND token = ?");
    $stmt->bind_param("is", $user_id, $token);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->num_rows > 0;
}

function updateUser($con, $user_id, $data) {
    // Check if user exists
    $stmt = $con->prepare("SELECT * FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 0) {
        return ['status' => false, 'message' => "User doesn't exist"];
    }

    // Check if email already exists
    if (isset($data['email'])) {
        $stmt = $con->prepare("SELECT * FROM users WHERE email = ? AND user_id != ?");
        $stmt->bind_param("si", $data['email'], $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return ['status' => false, 'message' => 'Email already exists'];
        }
    }

    // Building the SQL query dynamically
    $fields = [];
    $params = [];
    $types = "";

    if (isset($data['email'])) {
        $fields[] = "email = ?";
        $params[] = $data['email'];
        $types .= "s";
    }
    if (isset($data['password'])) {
        $fields[] = "password = ?";
        $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        $types .= "s";
    }
    if (isset($data['firstname'])) {
        $fields[] = "firstname = ?";
        $params[] = $data['firstname'];
        $types .= "s";
    }
    if (isset($data['lastname'])) {
        $fields[] = "lastname = ?";
        $params[] = $data['lastname'];
        $types .= "s";
    }
    if (isset($data['dob'])) {
        $fields[] = "dob = ?";
        $params[] = $data['dob'];
        $types .= "s";
    }
    if (isset($data['country'])) {
        $fields[] = "country = ?";
        $params[] = $data['country'];
        $types .= "s";
    }
    if (isset($data['role'])) {
        $fields[] = "role = ?";
        $params[] = $data['role'];
        $types .= "s";
    }
    if (isset($data['dashboard'])) {
        $fields[] = "dashboard = ?";
        $params[] = $data['dashboard'];
        $types .= "s";
    }

    if (count($fields) == 0) {
        return ['status' => false, 'message' => 'No fields to update'];
    }

    $params[] = $user_id;
    $types .= "i";

    $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE user_id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        return ['status' => true, 'message' => 'User updated successfully'];
    } else {
        return ['status' => false, 'message' => 'Update failed'];
    }
}

function deleteUser($con, $user_id) {
    // Check if user exists
    $stmt = $con->prepare("SELECT * FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 0) {
        return ['status' => false, 'message' => "User doesn't exist"];
    }

    $stmt = $con->prepare("DELETE FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    if ($stmt->execute()) {
        return ['status' => true, 'message' => 'User deleted successfully'];
    } else {
        return ['status' => false, 'message' => 'Deletion failed'];
    }
}

$request_method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($_SERVER['PATH_INFO'], '/'));

switch ($path[0]) {
    case 'users':
        if ($request_method == 'GET') {
            if (validateToken($con, $_GET['user_id'], $_SERVER['HTTP_TOKEN'])) {
                $result = $con->query("SELECT * FROM users");
                $response = $result->fetch_all(MYSQLI_ASSOC);
                header('Content-Type: application/json');
                header('Access-Control-Allow-Origin: *');

                echo json_encode($response, JSON_PRETTY_PRINT);
            } else {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
            }
        } elseif ($request_method == 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $response = registerUser($con, $data['email'], $data['password']);
            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');

            echo json_encode($response, JSON_PRETTY_PRINT);
        }
        break;

    case 'user':
        if ($request_method == 'GET' && isset($path[1])) {
            $user_id = intval($path[1]);
            if (validateToken($con, $user_id, $_SERVER['HTTP_TOKEN'])) {
                $stmt = $con->prepare("SELECT * FROM users WHERE user_id = ?");
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $result = $stmt->get_result();
                $response = $result->fetch_assoc();
                header('Content-Type: application/json');
                header('Access-Control-Allow-Origin: *');

                echo json_encode($response, JSON_PRETTY_PRINT);
            } else {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
            }
        } elseif ($request_method == 'PUT' && isset($path[1])) {
            $user_id = intval($path[1]);
            if (validateToken($con, $user_id, $_SERVER['HTTP_TOKEN'])) {
                $data = json_decode(file_get_contents('php://input'), true);
                $response = updateUser($con, $user_id, $data);
                header('Content-Type: application/json');
                header('Access-Control-Allow-Origin: *');

                echo json_encode($response, JSON_PRETTY_PRINT);
            } else {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
            }
        } elseif ($request_method == 'DELETE' && isset($path[1])) {
            $user_id = intval($path[1]);
            if (validateToken($con, $user_id, $_SERVER['HTTP_TOKEN'])) {
                $response = deleteUser($con, $user_id);
                header('Content-Type: application/json');
                header('Access-Control-Allow-Origin: *');

                echo json_encode($response, JSON_PRETTY_PRINT);
            } else {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
            }
        }
        break;

    case 'auth':
        if ($request_method == 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $response = authenticateUser($con, $data['email'], $data['password']);
            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');

            echo json_encode($response, JSON_PRETTY_PRINT);
        }
        break;

    default:
        http_response_code(404);
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');

        echo json_encode(['message' => 'Not Found'], JSON_PRETTY_PRINT);
        break;
}
?>
