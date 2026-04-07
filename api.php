<?php
require_once 'kapcsolat.php';
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM mozi");
        $mozik = $stmt->fetchAll();
        echo json_encode($mozik);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->mozinev) && !empty($data->cim)) {
            $stmt = $pdo->prepare("INSERT INTO mozi (mozinev, cim) VALUES (?, ?)");
            $stmt->execute([$data->mozinev, $data->cim]);
            echo json_encode(["message" => "Sikeres hozzáadás"]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->moziazon)) {
            $stmt = $pdo->prepare("DELETE FROM mozi WHERE moziazon = ?");
            $stmt->execute([$data->moziazon]);
            echo json_encode(["message" => "Sikeres törlés"]);
        }
        break;
}
?>