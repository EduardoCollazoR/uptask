<?php
session_start();
include 'inc/funciones/funciones.php';
include 'inc/templates/header.php';


if (isset($_GET['cerrar_sesion'])) {
    $_SESSION = array();
}
?>

<div class="contenedor-formulario">
    <h1>UpTask <span>Iniciar Sesion</span></h1>
    <form id="formulario" class="caja-login" method="post">
        <div class="campo">
            <label for="usuario"> Nombre de Usuario </label>
            <input type="text" name="usuario" id="usuario" placeholder="Nombre de Usuario">
        </div>
        <div class="campo">
            <label for="password">Contraseña </label>
            <input type="password" name="password" id="password" placeholder="Contraseña">
        </div>
        <div class="campo enviar">
            <input type="hidden" id="tipo" value="login">
            <input type="submit" class="boton" value="Iniciar Sesión">
        </div>
        <div class="campo">
            <a href="crear-cuenta.php">Crea cuenta nueva</a>
        </div>
    </form>
</div>

<?php
include 'inc/templates/footer.php';
?>