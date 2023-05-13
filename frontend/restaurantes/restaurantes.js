import ManipulacionDOM from "../DOM.js";

// Definir la URL del servidor como una variable global
const API_URL = 'http://localhost:3000/restaurantes';

//TODO: ALE REFACTORIZAR LOS NOMBRES DE LOS FORMS

// Obtener los elementos del DOM
const tablaBody = document.getElementById("tabla-body");
const formulario = document.querySelector("form");
const editarFormulario = document.getElementById("editar-formulario");
const editarForm = editarFormulario.querySelector("form");

const manipulacionDOM = new ManipulacionDOM(formulario, tablaBody, editarFormulario, editarForm, API_URL, (a, b) => a.id - b.id);

manipulacionDOM.refrescarTabla()
