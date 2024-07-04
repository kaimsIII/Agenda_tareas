document.addEventListener('DOMContentLoaded', () => {
  cargarTareas();
  cargarModoOscuro();
});
document.getElementById('btnAgregar').addEventListener('click', agregarTarea);
document.getElementById('inputTarea').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    agregarTarea();
  }
});
document.getElementById('btnTodas').addEventListener('click', () => filtrarTareas('todas'));
document.getElementById('btnCompletadas').addEventListener('click', () => filtrarTareas('completadas'));
document.getElementById('btnPendientes').addEventListener('click', () => filtrarTareas('pendientes'));
document.getElementById('btnModoOscuro').addEventListener('click', toggleModoOscuro);

function toggleModoOscuro() {
  const cuerpo = document.body;
  cuerpo.classList.toggle('modo-oscuro');
  const esModoOscuro = cuerpo.classList.contains('modo-oscuro');
  localStorage.setItem('modoOscuro', esModoOscuro);
  actualizarTextoBotonModoOscuro(esModoOscuro);
}

function cargarModoOscuro() {
  const esModoOscuro = JSON.parse(localStorage.getItem('modoOscuro'));
  if (esModoOscuro) {
    document.body.classList.add('modo-oscuro');
  }
  actualizarTextoBotonModoOscuro(esModoOscuro);
}

function actualizarTextoBotonModoOscuro(esModoOscuro) {
  const botonModoOscuro = document.getElementById('btnModoOscuro');
  botonModoOscuro.textContent = esModoOscuro ? 'Modo Claro' : 'Modo Oscuro';
}

// Resto del código de funciones para manejar tareas...
document.addEventListener('DOMContentLoaded', cargarTareas);
document.getElementById('btnAgregar').addEventListener('click', agregarTarea);
document.getElementById('inputTarea').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    agregarTarea();
  }
});
document.getElementById('btnTodas').addEventListener('click', () => filtrarTareas('todas'));
document.getElementById('btnCompletadas').addEventListener('click', () => filtrarTareas('completadas'));
document.getElementById('btnPendientes').addEventListener('click', () => filtrarTareas('pendientes'));

function agregarTarea() {
  const inputTarea = document.getElementById('inputTarea');
  const inputFechaVencimiento = document.getElementById('inputFechaVencimiento');
  const selectPrioridad = document.getElementById('selectPrioridad');
  const textoTarea = inputTarea.value.trim();
  const fechaVencimiento = inputFechaVencimiento.value;
  const prioridad = selectPrioridad.value;
  if (textoTarea && fechaVencimiento && prioridad) {
    crearElementoTarea(textoTarea, false, fechaVencimiento, prioridad);
    inputTarea.value = ''; // Limpiar el input después de agregar la tarea
    inputFechaVencimiento.value = ''; // Limpiar la fecha de vencimiento
    selectPrioridad.value = '1'; // Resetear la prioridad a 1
    guardarTareas();
  }
}

function crearElementoTarea(texto, completada = false, fechaVencimiento, prioridad) {
  const li = document.createElement('li');
  li.className = 'tarea';
  if (completada) {
    li.classList.add('tarea-completada');
  }

  const spanTexto = document.createElement('span');
  spanTexto.contentEditable = true;
  spanTexto.textContent = texto;
  spanTexto.addEventListener('blur', guardarTareas); // Guardar al perder el foco

  const spanFecha = document.createElement('span');
  spanFecha.textContent = ` (Vence: ${fechaVencimiento})`;
  spanFecha.className = 'fecha-vencimiento';

  const spanPrioridad = document.createElement('span');
  spanPrioridad.textContent = ` [Prioridad: ${prioridad}]`;
  spanPrioridad.className = 'prioridad';

  const btnCompletar = document.createElement('button');
  btnCompletar.textContent = 'Completar';
  btnCompletar.addEventListener('click', function() {
    li.classList.toggle('tarea-completada');
    guardarTareas();
  });

  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.addEventListener('click', function() {
    li.remove();
    guardarTareas();
  });

  li.appendChild(spanTexto);
  li.appendChild(spanFecha);
  li.appendChild(spanPrioridad);
  li.appendChild(btnCompletar);
  li.appendChild(btnEliminar);
  document.getElementById('listaTareas').appendChild(li);
  guardarTareas();
}

function cargarTareas() {
  const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
  document.getElementById('listaTareas').innerHTML = ''; // Limpiar lista actual
  tareas.forEach(tarea => {
    crearElementoTarea(tarea.texto, tarea.completada, tarea.fechaVencimiento, tarea.prioridad);
  });
}

function guardarTareas() {
  const tareas = [];
  document.querySelectorAll('#listaTareas .tarea').forEach(tarea => {
    const texto = tarea.querySelector('span').textContent.trim();
    const fechaVencimiento = tarea.querySelector('.fecha-vencimiento').textContent.match(/\(([^)]+)\)/)[1].replace('Vence: ', '');
    const prioridad = tarea.querySelector('.prioridad').textContent.match(/\[(\d+)\]/)[1];
    const completada = tarea.classList.contains('tarea-completada');
    tareas.push({texto, completada, fechaVencimiento, prioridad});
  });
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

function filtrarTareas(filtro) {
  const todasLasTareas = document.querySelectorAll('#listaTareas .tarea');
  todasLasTareas.forEach(tarea => {
    switch (filtro) {
      case 'completadas':
        if (tarea.classList.contains('tarea-completada')) {
          tarea.style.display = '';
        } else {
          tarea.style.display = 'none';
        }
        break;
      case 'pendientes':
        if (!tarea.classList.contains('tarea-completada')) {
          tarea.style.display = '';
        } else {
          tarea.style.display = 'none';
        }
        break;
      default:
        tarea.style.display = '';
        break;
    }
  });
}