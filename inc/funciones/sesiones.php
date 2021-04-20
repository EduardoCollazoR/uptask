<?php
function usuario_autenticado()
{
    if (!revisar_usuario()) {
        header('Location:login.php');
        exit();
    }
}

function revisar_usuario()
{
    return isset($_SESSION['nombre']);
}
session_start();
if (isset($_SESSION['time']) && $_SESSION['time'] + 10 < time()) { //tiempo en segundos, se puede poner + 1 * (dias * horas * minutos * segundos)
    session_unset(); //elimina todas las variables de sesion
    session_destroy(); //destruye la sesion pero no las variables
};
usuario_autenticado();
