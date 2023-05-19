// Definir la URL del servidor como una variable global
const API_URL = 'http://localhost:3000/';

// Obtener los elementos del DOM
const formReserva = document.getElementById("formReserva");
const selectRestaurantes = document.getElementById("selectRestaurantes");
const fecha = document.getElementById("fecha");
const desdeHora = document.getElementById("desdeHora");
const hastaHora = document.getElementById("hastaHora");

function getRestaurantes() {
    fetch(API_URL + 'restaurantes')
        .then(response => response.json())
        .then(restaurantes => {
            restaurantes.forEach(restaurante => {
                selectRestaurantes.innerHTML += `<option value="${restaurante.id}">${restaurante.nombre}</option>`;
            });
        })
        .catch(error => console.log(error));    
}

desdeHora.addEventListener("change", async (event) => {
    event.preventDefault();
    const desdeHoraValue = Number(desdeHora.value);
    hastaHora.innerHTML = ""
    hastaHora.removeAttribute('disabled')
    for (let index = desdeHoraValue + 1; index < 24; index++) { 
        hastaHora.innerHTML += `<option value="${index}">${index}</option>`;
    }
})

formReserva.addEventListener("submit", async (event) => {
    event.preventDefault();



})

getRestaurantes()