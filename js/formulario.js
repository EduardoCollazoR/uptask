eventListener();

function eventListener() {
  document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
  e.preventDefault();

  var usuario = document.querySelector('#usuario').value,
    password = document.querySelector('#password').value,
    tipo = document.querySelector('#tipo').value;

  if (usuario === '' || password === '') {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Ambos campos son obligatorios!',
      confirmButtonText: 'Entendido',
    });
  } else {

    //son correctos, mandar ajax
    //datos que se envian al servidor
    var datos = new FormData();
    datos.append('usuario', usuario);
    datos.append('password', password);
    datos.append('accion', tipo);

    //llamado ajax
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'inc/modelos/modelo-admin.php', true);


    xhr.onload = function() {
      if (this.status === 200) {

        var respuesta = JSON.parse(xhr.responseText);
        //validar respuesta
        if (respuesta.respuesta === 'correcto') {
          //nuevo usuario 
          if (respuesta.tipo === 'crear') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Usuario creado',
              text: 'Usuario creado correctamente',
              showConfirmButton: false,
              timer: 1500
            });
          } else if (respuesta.tipo === 'login') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Acceso correcto',
              text: 'Presiona Acceso para entrar al sistema',
              confirmButtonText: 'Acceso'
            }).then(result => {
              if (result.value) {
                window.location.href = 'index.php';
              }
            })
          }
        } else {
          //hubo error
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Hubo un error',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    }

    xhr.send(datos);

  }

}