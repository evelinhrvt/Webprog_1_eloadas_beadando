<?php
$pdo = require 'kapcsolat.php';

header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
    $input = array();
}

try {
    switch ($method) {
        case "GET":
            $stmt = $pdo->query("SELECT moziazon, mozinev, irszam, cim, telefon FROM mozi ORDER BY moziazon");
            echo json_encode($stmt->fetchAll());
            break;

        case "POST":
            if (empty($input["mozinev"]) || empty($input["cim"])) {
                echo json_encode(array("hiba" => "Hianyzo adat."));
                break;
            }

            $stmt = $pdo->query("SELECT COALESCE(MAX(moziazon), 0) + 1 AS kovetkezo FROM mozi");
            $sor = $stmt->fetch();
            $kovetkezoAzon = $sor["kovetkezo"];

            $stmt = $pdo->prepare(
                "INSERT INTO mozi (moziazon, mozinev, irszam, cim, telefon)
                 VALUES (:moziazon, :mozinev, :irszam, :cim, :telefon)"
            );

            $stmt->execute(array(
                "moziazon" => $kovetkezoAzon,
                "mozinev" => $input["mozinev"],
                "irszam" => isset($input["irszam"]) ? $input["irszam"] : null,
                "cim" => $input["cim"],
                "telefon" => isset($input["telefon"]) ? $input["telefon"] : null
            ));

            echo json_encode(array("uzenet" => "Sikeres hozzaadas."));
            break;

        case "PUT":
            if (empty($input["moziazon"]) || empty($input["mozinev"]) || empty($input["cim"])) {
                echo json_encode(array("hiba" => "Hianyzo adat."));
                break;
            }

            $stmt = $pdo->prepare(
                "UPDATE mozi
                 SET mozinev = :mozinev, irszam = :irszam, cim = :cim, telefon = :telefon
                 WHERE moziazon = :moziazon"
            );

            $stmt->execute(array(
                "mozinev" => $input["mozinev"],
                "irszam" => isset($input["irszam"]) ? $input["irszam"] : null,
                "cim" => $input["cim"],
                "telefon" => isset($input["telefon"]) ? $input["telefon"] : null,
                "moziazon" => $input["moziazon"]
            ));

            echo json_encode(array("uzenet" => "Sikeres modositas."));
            break;

        case "DELETE":
            if (empty($input["moziazon"])) {
                echo json_encode(array("hiba" => "Hianyzo azonosito."));
                break;
            }

            $pdo->beginTransaction();

            $stmt = $pdo->prepare("DELETE FROM hely WHERE moziazon = :moziazon");
            $stmt->execute(array("moziazon" => $input["moziazon"]));

            $stmt = $pdo->prepare("DELETE FROM mozi WHERE moziazon = :moziazon");
            $stmt->execute(array("moziazon" => $input["moziazon"]));

            $pdo->commit();

            echo json_encode(array("uzenet" => "Sikeres torles."));
            break;

        default:
            echo json_encode(array("hiba" => "Nem tamogatott keres."));
            break;
    }
} catch (Exception $e) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($e->getMessage());
    echo json_encode(array("hiba" => "Adatbazis hiba tortent."));
}
?>
