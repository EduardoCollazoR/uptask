// (function() {
//   'use strict';

//   function inactivo() {

//     document.addEventListener('mousemove', resetTiempo, false);
//     document.addEventListener('click', resetTiempo, false);
//     document.addEventListener('scroll', resetTiempo, false);
//     let time;

//     function reload() {
//       time = window.setTimeout(function() {
//         window.location.reload();
//       }, 10000);
//     }

//     function resetTiempo() {
//       clearTimeout(time);
//       reload();
//     };

//   };
//   inactivo();
// })();