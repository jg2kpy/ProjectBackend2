// Definir la URL del servidor como una variable global
const API_URL = 'http://localhost:3000/';

// Obtener los elementos del DOM
const formConsumo = document.getElementById("formConsumo");
const formConfirmarReserva = document.getElementById("formConfirmarReserva");
const selectMesas = document.getElementById("selectMesas");
const desdeHora = document.getElementById("desdeHora");
const hastaHora = document.getElementById("hastaHora");
const tablaBody = document.getElementById("tabla-body");
const botonAgregarDetalle = document.getElementById("boton_agregar_detalle");
const divAgregarDetalleForm = document.getElementById("agregar-detalle-formulario")
const agregarDetalleForm = divAgregarDetalleForm.querySelector("form");

function getMesas() {
    fetch(API_URL + 'mesas')
        .then(response => response.json())
        .then(mesas => {
            mesas.forEach(mesa => {
                selectMesas.innerHTML += `<option value="${mesa.id}">${mesa.nombre}</option>`;
            });
        })
        .catch(error => console.error(error));
}


selectMesas.addEventListener("click", async (event) => {
    event.preventDefault();

    const buscar = {
        id_mesa: parseInt(selectMesas.value)
    }

    refrescarTabla(buscar);

})

botonAgregarDetalle.addEventListener("click", async (event) => {
    event.preventDefault();
    mostrarAgregarDetallesFormulario();
})

async function mostrarAgregarDetallesFormulario(elemento) {
    // habilito el display del form
    divAgregarDetalleForm.style.display = "block";

    Object.keys(elemento).forEach((key) => {
        const field = agregarDetalleForm.elements[key];
        if (field !== undefined) {
            field.value = elemento[key];    
        }
    })
}

async function ocultarAgregarDetallesFormulario() {
    agregarDetalleForm.reset();
    divAgregarDetalleForm.style.display = "none";
}

agregarDetalleForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let DTO = {};

    let fields = Array.from(agregarDetalleForm.querySelectorAll("input"));
    fields.forEach((field) => {
        DTO[field.id] = field.value;
    })

    const resultado = await agregarElemento(DTO);
    if (resultado) {
        ocultarAgregarDetallesFormulario();
        refrescarTabla({id_mesa: parseInt(selectMesas.value)});
    }else{
        alert("No se pudo editar el elemento");
    }
})

async function agregarElemento(elemento) {
    try {
        const response = await fetch(API_URL+"consumo/detalle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(elemento)
        });
        const data = await response.json();
        return response.status === 200;
    } catch (error) {
        console.error(error);
    }
}

async function refrescarTabla(buscar) {
    const elementos = await obtenerElementos(buscar);

    tablaBody.innerHTML = "";

    elementos[0].ConsumoDetalles.forEach((elemento) => {
        const fila = crearFila(elemento);
        tablaBody.appendChild(fila);
    });
}

async function obtenerElementos(buscar) {
    try {
        const response = await fetch(API_URL + 'consumo?id_mesa=' + buscar.id_mesa, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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

getMesas()