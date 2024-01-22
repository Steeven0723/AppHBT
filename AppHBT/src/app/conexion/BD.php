<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Allow: GET, POST, OPTIONS, PUT, DELETE');

$conn = mysqli_connect('localhost', 'root', '', 'hbt');

if (!$conn) {
    die('No se pudo Conectar a la base de datos' . mysqli_connect_error());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $cantidad = $_POST['cantidad'];
    $fechaPago = $_POST['fechaPago'];
  
  
    $sql = "INSERT INTO pagos (nombre, cantidad, fechaPago) VALUES ('$nombre', '$cantidad', '$fechaPago')";
    
    if (mysqli_query($conn, $sql)) {
      echo json_encode(['message' => 'Registro guardado con éxito']);
    } else {
      echo json_encode(['error' => 'Error al guardar el registro: ' . mysqli_error($conn)]);
    }
  
    mysqli_close($conn);
  }