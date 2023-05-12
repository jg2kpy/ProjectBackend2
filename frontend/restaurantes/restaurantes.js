import { obtenerElementos } from "../utils.js";

// Definir la URL del servidor como una variable global
const API_URL = 'http://localhost:3000/restaurantes';

// Obtener los elementos del DOM
const formulario = document.querySelector("form");
const tablaBody = document.getElementById("tabla-body");
const editarFormulario = document.getElementById("editar-formulario");
const editarForm = editarFormulario.querySelector("form");


async function refrescarTabla() {
    const elementos = await obtenerElementos(API_URL);

    tablaBody.innerHTML = "";

    elementos.sort((a, b) => a.id - b.id);

    elementos.forEach((elemento) => {
        const fila = crearFila(elemento);
        tablaBody.appendChild(fila);
    });
}

function crearFila(elemento) {
    const fila = document.createElement("tr");

    Object.keys(elemento).forEach(function(key,index) {
        //TODO: ALEEEE Verificar cuando sea una fecha
        if(key !== "createdAt" && key !== "updatedAt"){
            const td = document.createElement("td");
            td.textContent = elemento[key]
            fila.appendChild(td)
        }
    });

    const acciones = document.createElement("td");
    const editarBoton = document.createElement("button");
    editarBoton.textContent = "Editar";
    editarBoton.addEventListener("click", () => mostrarEditarFormulario(regla));
    acciones.appendChild(editarBoton);
    const eliminarBoton = document.createElement("button");
    eliminarBoton.textContent = "Eliminar";
    eliminarBoton.addEventListener("click", () => eliminarReglaClick(regla));
    acciones.appendChild(eliminarBoton);
    fila.appendChild(acciones);

    return fila
}

refrescarTabla()
