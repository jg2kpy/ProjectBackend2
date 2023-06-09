import ManipulacionDOM from "../ManipulacionDOM.js";

// Definir la URL del servidor como una variable global
const API_URL = 'http://localhost:3000/productos';

// Obtener los elementos del DOM
const tablaBody = document.getElementById("tabla-body");
const agregarForm = document.querySelector("form");
const divEditarForm = document.getElementById("editar-formulario");
const editarForm = divEditarForm.querySelector("form");

const manipulacionDOM = new ManipulacionDOM(agregarForm, tablaBody, divEditarForm, editarForm, API_URL, (a, b) => a.id - b.id);

manipulacionDOM.refrescarTabla()
