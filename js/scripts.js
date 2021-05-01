eventListener();
//lista de Proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListener() {


  //document ready
  document.addEventListener('DOMContentLoaded', function() {
    actualizarProgreso();
  });
  //boton para crear proyecto 
  document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

  //boton nueva tarea
  document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

  //botones para las acciones de las tareas 
  document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
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
    < a href = "index.php?id_proyecto=${id_proyecto}"
    id ="proyecto:${id_proyecto}" >
    ${proyecto}
    </>
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
    datos.append('accion', 'crear');
    datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

    xhr.open('POST', 'inc/modelos/modelo-tareas.php');

    xhr.onload = function() {
      if (this.status === 200) {
        var respuesta = JSON.parse(xhr.responseText);
        console.log(respuesta);
        //asignar variables 
        var resultado = respuesta.respuesta,
          tarea = respuesta.tarea,
          id_insertado = respuesta.id_insert,
          tipo = respuesta.tipo;

        if (resultado === 'correcto') {
          //se agrego

          if (tipo === 'crear') {
            //alerta
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Tarea creada',
              text: 'La tarea : ' + tarea + ' se creo correctamente',
              showConfirmButton: false,
              timer: 1500

            });


            //selecciona el parrafo lista vacias
            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');

            if (parrafoListaVacia.length > 0) {
              document.querySelector('.lista-vacia').remove;
            }
            //contruir template

            var nuevaTarea = document.createElement('LI');

            //agregar id
            nuevaTarea.id = 'tarea:' + id_insertado;

            //agregar la clase tarea
            nuevaTarea.classList.add('tarea');
            //construir en el html 
            nuevaTarea.innerHTML = `
<p>${tarea}</p>
<div class="acciones">
<i class = "fas fa-check"></i></i>
<i class = "fas fa-trash"></i>
</div>
            `;

            //agregarlo al html

            var listadoProyectos = document.querySelector('.listado-pendientes ul');
            listadoProyectos.appendChild(nuevaTarea);

            //limpiar el formulario
            document.querySelector('.agregar-tarea').reset();
            //actualizar el progreso
            actualizarProgreso();
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

}


//cambia el estado de las tareas o las elimina 
function accionesTareas(e) {
  e.preventDefault();
  console.log(e.target)
  if (e.target.classList.contains('fa-check')) {
    if (e.target.classList.contains('completo')) {
      e.target.classList.remove('completo');

      cambiarEstadoTarea(e.target, 0);
    } else {
      e.target.classList.add('completo');
      cambiarEstadoTarea(e.target, 1);
    }

  }

  if (e.target.classList.contains('fa-trash')) {
    Swal.fire({
      title: 'Seguro?',
      text: "Esta accion no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        var tareaEliminar = e.target.parentElement.parentElement;
        //borrar de la bd
        eliminarTareaBD(tareaEliminar);

        //borrar del html
        tareaEliminar.remove();
        Swal.fire({
          title: 'Eliminado!',
          text: 'La tarea fue eliminada.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }
}

//completa o descompleta una tarea 
function cambiarEstadoTarea(tarea, estado) {
  var idTarea = tarea.parentElement.parentElement.id.split(':');

  //crear llamado ajax

  var xhr = new XMLHttpRequest();

  var datos = new FormData();
  datos.append('id', idTarea[1]);
  datos.append('accion', 'actualizar');
  datos.append('estado', estado);




  xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

  xhr.onload = function() {
    if (this.status == 200) {
      console.log(JSON.parse(xhr.responseText));
      //actualizar el progreso
      actualizarProgreso();
    }
  }

  xhr.send(datos);
}

//elimina las tareas de la bd 
function eliminarTareaBD(tarea) {
  var idTarea = tarea.id.split(':');

  //crear llamado ajax

  var xhr = new XMLHttpRequest();

  var datos = new FormData();
  datos.append('id', idTarea[1]);
  datos.append('accion', 'eliminar');




  xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

  xhr.onload = function() {
    if (this.status == 200) {
      //comprobar que halla tareas restantes 
      var listaTareasRestantes = document.querySelectorAll('li.tarea');

      if (listaTareasRestantes.length === 0) {
        document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
      }

      //actualizar el progreso
      actualizarProgreso();

    }
  }

}


//actuliza el avance del proyecto 
function actualizarProgreso() {


  //obtener todas las tareas 
  const tareas = document.querySelectorAll('li.tarea');

  //obtener las tareas completadas la
  const tareasCompletadas = document.querySelectorAll('i.completo');


  //determinar el avance 
  const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

  //asignar avance ala barra 
  const porcentaje = document.querySelector('#porcentaje');
  porcentaje.style.width = avance + '%';

  //mostrar una alerta  alcompletar al 100% 

  if (avance === 100) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Proyecto Terminado',
      text: 'Ya no tienes tareas pendientes!',
      showConfirmButton: false,
      timer: 1500
    });
  }


}