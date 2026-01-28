// =====================
// CLASE TAREA
// =====================
class Tarea {
    constructor(nombre, completa = false) {
      this.id = Date.now();
      this.nombre = nombre;
      this.completa = completa;
    }
  }
  
  // =====================
  // CLASE GESTOR DE TAREAS
  // =====================
  class GestorDeTareas {
    constructor() {
      this.tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    }
  
    agregarTarea(tarea) {
      this.tareas.push(tarea);
      this.guardar();
    }
  
    eliminarTarea(id) {
      this.tareas = this.tareas.filter(t => t.id !== id);
      this.guardar();
    }
  
    editarTarea(id, nuevoNombre) {
      this.tareas.forEach(t => {
        if (t.id === id) t.nombre = nuevoNombre;
      });
      this.guardar();
    }
  
    guardar() {
      localStorage.setItem("tareas", JSON.stringify(this.tareas));
    }
  }
  
  // =====================
  // DOM
  // =====================
  const input = document.getElementById("tareaInput");
  const boton = document.getElementById("agregarBtn");
  const lista = document.getElementById("listaTareas");
  const error = document.getElementById("error");
  
  const gestor = new GestorDeTareas();
  
  // =====================
  // MOSTRAR TAREAS
  // =====================
  function mostrarTareas() {
    lista.innerHTML = "";
  
    gestor.tareas.forEach(tarea => {
      const li = document.createElement("li");
  
      const img = document.createElement("img");
      img.src = "tarea.png";
      img.classList.add("icono");
  
      const span = document.createElement("span");
      span.textContent = tarea.nombre;
  
      const acciones = document.createElement("div");
      acciones.classList.add("acciones");
  
      const editar = document.createElement("button");
      editar.textContent = "Editar";
      editar.onclick = () => {
        const nuevo = prompt("Editar tarea:", tarea.nombre);
        if (nuevo && nuevo.trim() !== "") {
          gestor.editarTarea(tarea.id, nuevo);
          mostrarTareas();
        }
      };
  
      const eliminar = document.createElement("button");
      eliminar.textContent = "Eliminar";
      eliminar.onclick = () => {
        gestor.eliminarTarea(tarea.id);
        mostrarTareas();
      };
  
      acciones.append(editar, eliminar);
      li.append(img, span, acciones);
      lista.appendChild(li);
    });
  }
  
  // =====================
  // AGREGAR TAREA
  // =====================
  boton.addEventListener("click", () => {
    const texto = input.value.trim();
  
    if (texto === "") {
      error.textContent = "⚠️ No puedes agregar una tarea vacía agregale un titulo";
      return;
    }
  
    error.textContent = "";
    gestor.agregarTarea(new Tarea(texto));
    input.value = "";
    mostrarTareas();
  });
  
  mostrarTareas();
  