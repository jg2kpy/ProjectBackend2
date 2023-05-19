// Definir la URL del servidor como una variable global
const API_URL = 'http://localhost:3000/';

// Obtener los elementos del DOM
const formReserva = document.getElementById("formReserva");
const formConfirmarReserva = document.getElementById("formConfirmarReserva");
const selectRestaurantes = document.getElementById("selectRestaurantes");
const fecha = document.getElementById("fecha");
const desdeHora = document.getElementById("desdeHora");
const hastaHora = document.getElementById("hastaHora");
const tablaBody = document.getElementById("tabla-body");

fecha.min = new Date().toISOString().split("T")[0];

function getRestaurantes() {
    fetch(API_URL + 'restaurantes')
        .then(response => response.json())
        .then(restaurantes => {
            restaurantes.forEach(restaurante => {
                selectRestaurantes.innerHTML += `<option value="${restaurante.id}">${restaurante.nombre}</option>`;
            });
        })
        .catch(error => console.error(error));
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

    const buscar = {
        id_restaurante: parseInt(selectRestaurantes.value),
        fecha: fecha.value,
        desdeHora: parseInt(desdeHora.value),
        hastaHora: parseInt(hastaHora.value)
    }

    refrescarTabla(buscar);

})

formConfirmarReserva.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cedula = parseInt(document.getElementById("cedula").value);

    const verificacion = await verificarCedula(cedula);

    if (verificacion === -1) {
        if (confirm("Cédula no registrada, desea registrarse?")) {
            window.location.href = "http://localhost/clientes/clientes";
        }
        return
    }

    const fila = getCheckedRadioValue("option");
    const id_mesa = parseInt(fila.children[0].innerText)
    const cantidad = parseInt(fila.children[5].innerText)

    const reserva = {
        id_restaurante: parseInt(selectRestaurantes.value),
        id_mesa: id_mesa,
        fecha: fecha.value,
        desdeHora: parseInt(desdeHora.value),
        hastaHora: parseInt(hastaHora.value),
        id_cliente: verificacion,
        cantidad: cantidad
    }

    const response = await fetch(API_URL + 'reservas', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reserva),
    })

})

function getCheckedRadioValue(name) {
    var elements = document.getElementsByName(name);
    
    for (var i=0, len=elements.length; i<len; ++i)
        if (elements[i].checked) return elements[i].parentElement.parentElement;
    }

async function verificarCedula(cedula) {
    //obtener todos los clientes con fetch y verificar si existe la cedula
    try {
        const response = await fetch(API_URL + 'clientes');
        const elementos = await response.json();
        for (let index = 0; index < elementos.length; index++) {
            if (elementos[index].cedula === cedula) {
                return elementos[index].id;
            }
        }
        return -1;
    } catch (error) {
        console.error(error);
    }
}

async function refrescarTabla(buscar) {
    const elementos = await obtenerElementos(buscar);

    tablaBody.innerHTML = "";

    elementos.forEach((elemento) => {
        const fila = this.crearFila(elemento);
        tablaBody.appendChild(fila);
    });
}

async function obtenerElementos(buscar) {
    try {
        const response = await fetch(API_URL + 'reservas/libres', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(buscar),
        }
        );
        const elementos = await response.json();
        return elementos;
    } catch (error) {
        console.error(error);
    }
}

function crearFila(elemento) {
    const fila = document.createElement("tr");

    Object.keys(elemento).forEach((key) => {
        if (elemento[key] !== null) {
            const td = document.createElement("td")
            const value = elemento[key]

            td.textContent = value

            fila.appendChild(td)
        }
    })

    const acciones = document.createElement("td");

    const radioReservar = document.createElement("input");
    radioReservar.type = "radio";
    radioReservar.name = "option";
    radioReservar.value = elemento.id;
    acciones.appendChild(radioReservar);
    fila.appendChild(acciones);

    return fila
}

async function reservarClick(elemento) {
    const confirmacion = confirm(`¿Desea reservar el elemento ${elemento.id}?`);
    if (confirmacion) {
        const respuesta = await reservar(elemento);
        if (!respuesta) {
            alert("No se pudo eliminar el elemento");
        }
    }
}

async function reservar(params) {

}

getRestaurantes()