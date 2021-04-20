eventListener();
//lista de Proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListener() {
  //boton para crear proyecto 
  document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

  //boton nueva tarea
  document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
}

function nuevoProyecto(e) {
  e.preventDefault();
  var listaProyectos = document.querySelector('ul#proyectos');

  //crea un input para el nuevo proyectos
  var nuevoProyecto = document.createElement('LI');
  nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto" class="campo">';
  listaProyectos.appendChild(nuevoProyecto);
  //selecconar el id del nuevo proyecto
  var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');


  //presionar enter y crea al proyecto
  inputNuevoProyecto.addEventListener('keypress', function(e) {
    var tecla = e.which || e.keycode;
    if (inputNuevoProyecto.value === "" && tecla === 13) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error!',
        showConfirmButton: false,
        timer: 1500
      });

    } else if (tecla === 13) {
      guardarProyectoDB(inputNuevoProyecto.value);
      listaProyectos.removeChild(nuevoProyecto);
    }
  });
}

function guardarProyectoDB(nombreProyecto) {


  var xhr = new XMLHttpRequest();

  var datos = new FormData();
  datos.append('proyecto', nombreProyecto);
  datos.append('accion', 'crear');

  xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

  xhr.onload = function() {
    if (this.status === 200) {
      var respuesta = JSON.parse(xhr.responseText);

      var proyecto = respuesta.nombre_proyecto,
        id_proyecto = respuesta.id_insertado,
        tipo = respuesta.tipo,
        resultado = respuesta.respuesta;
      //comprobar  la insercion
      if (resultado === 'correcto') {
        if (tipo === 'crear') {
          // se creo un proyecto 
          //inyectar html 
          var nuevoProyecto = document.createElement('LI');
          nuevoProyecto.innerHTML = `
    <a href = "index.php?id_proyecto=${id_proyecto}" id="${id_proyecto}">
    ${proyecto}
    </a>
    `;
          //agregar al html
          listaProyectos.appendChild(nuevoProyecto);

          //enviar alerta 
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Proyecto creado',
            text: 'El proyecto: ' + proyecto + ' se creo correctamente',
            confirmButtonText: 'Confirmar'
          }).then(result => {
            //redireccionar a nueva URL
            if (result.value) {
              window.location.href = 'index.php?id_proyecto=' + id_proyecto;
            }
          })



        } else {
          //se actualizo o elimino
        }

      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Hubo un error!',
          showConfirmButton: false,
          timer: 1500
        });
      }

    }

  }

  xhr.send(datos);

}

//agregar tarea la proyecto  actual
function agregarTarea(e) {
  e.preventDefault();
  var nombreTarea = document.querySelector('.nombre-tarea').value;
  //validar campo tarea
  if (nombreTarea === "") {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Hubo un error!',
      text: 'Una tarea no puede ir vacia',
      showConfirmButton: false,
      timer: 1500
    });
  } else {
    //la tarea tiene algo

    var xhr = new XMLHttpRequest();

    //formdata
    var datos = new FormData();
    datos.append('tarea', nombreTarea);
    datos.append('tipo', 'crear');
    datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

    xhr.open('POST', 'inc/modelos/modelo-tareas.php');

    xhr.onload = function() {
      if (this.status === 200) {
        var respuesta = JSON.parse(xhr.responseText);
        console.log(respuesta);
      }
    }

    xhr.send(datos);

  }

}