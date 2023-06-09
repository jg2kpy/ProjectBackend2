// Definir la URL del servidor como una variable global
const API_URL = 'http://localhost:3000/';

// Obtener los elementos del DOM
const formConsumo = document.getElementById("formConsumo");
const formConfirmarReserva = document.getElementById("formConfirmarReserva");
const selectMesas = document.getElementById("selectMesas");
const selectClientes = document.getElementById("selectClientes");
const inputCliente = document.getElementById("inputCliente");
const desdeHora = document.getElementById("desdeHora");
const hastaHora = document.getElementById("hastaHora");
const tablaBody = document.getElementById("tabla-body");
const divAgregarDetalleForm = document.getElementById("agregar-detalle-formulario")
const agregarDetalleForm = divAgregarDetalleForm.querySelector("form");
const divDetalles = document.getElementById("divDetalles");
const estado = document.getElementById("estado");
const cliente = document.getElementById("cliente");
const total = document.getElementById("total")
const formDesocuparMesa = document.getElementById("desocuparMesa");

let id_cabecera = 0;

async function getMesas() {
    await fetch(API_URL + 'mesas')
        .then(response => response.json())
        .then(mesas => {
            mesas.forEach(mesa => {
                selectMesas.innerHTML += `<option value="${mesa.id}">${mesa.nombre}</option>`;
            });
        })
        .catch(error => console.error(error));
    const buscar = {
        id_mesa: parseInt(selectMesas.children[0].value)
    }
    refrescarTabla(buscar);
}

async function getClientes() {
    await fetch(API_URL + 'clientes')
        .then(response => response.json())
        .then(clientes => {
            clientes.forEach(mesa => {
                selectClientes.innerHTML += `<option value="${mesa.id}">${mesa.cedula} - ${mesa.nombre}</option>`;
            });
        })
        .catch(error => console.error(error));  
}

formDesocuparMesa.addEventListener("submit", async (event) => {
    event.preventDefault();
    const DTO = { 
        id_cliente: parseInt(selectClientes.value),
        estado: "cerrado"
    }

    await fetch(`${API_URL}consumo/cabecera/${id_cabecera}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(DTO),
    })

    const buscar = {
        id_mesa: parseInt(selectMesas.value)
    }
    refrescarTabla(buscar);
})

formConfirmarReserva.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (estado.innerText === "Estado: Desocupado") {
        const DTO = { 
            id_mesa: parseInt(selectMesas.value),
            id_cliente: parseInt(selectClientes.value),
        }

        const cabecera = await fetch(API_URL + 'consumo/cabecera', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(DTO),
        })

        estado.innerText = `Estado: Ocupado`;
        divDetalles.hidden = false;

        cliente.innerText = `Cliente: ${selectClientes.options[selectClientes.selectedIndex].text}`;

        total.innerText = `Total: 0`;

        id_cabecera = await cabecera.json().then(data => data.id);
        console.log(id_cabecera);

        const buscar = {
            id_mesa: parseInt(selectMesas.value)
        }
        refrescarTabla(buscar);


    }else{
        const DTO = { 
            id_cliente: parseInt(selectClientes.value),
            estado: "abierto"
        }

        await fetch(`${API_URL}consumo/cabecera/${id_cabecera}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(DTO),
        })

        const buscar = {
            id_mesa: parseInt(selectMesas.value)
        }
        refrescarTabla(buscar);

    }

})


selectMesas.addEventListener("click", async (event) => {
    event.preventDefault();

    const buscar = {
        id_mesa: parseInt(selectMesas.value)
    }

    refrescarTabla(buscar);

})

inputCliente.addEventListener("input", async (event) => {
    Object.keys(selectClientes).forEach((key) => {
        const option = selectClientes[key];
        if (option.innerText.includes(inputCliente.value)) {
            option.selected = true;
            option.hidden = false
        }else{
            option.hidden = true
        }
    })
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

    console.log(resultado);

    if (resultado) {
        await refrescarTabla({id_mesa: parseInt(selectMesas.value)});
        console.log("Se agrego el elemento");
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
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function refrescarTabla(buscar) {
    const elementos = await obtenerElementos(buscar);

    tablaBody.innerHTML = "";

    if (elementos.length > 0) {
        estado.innerText = `Estado: Ocupado`;

        divDetalles.hidden = false;

        id_cabecera = elementos[0].id;

        elementos[0].ConsumoDetalles.forEach((elemento) => {
            delete elemento.updatedAt
            delete elemento.id_cabecera
            const fila = crearFila(elemento);
            tablaBody.appendChild(fila);
        });
        
        agregarDetalleForm.elements["id_cabecera"].value = parseInt(elementos[0].id);
        for (let index = 0; index < selectClientes.length; index++) {
            if (parseInt(selectClientes[index].value) === elementos[0].id_cliente) {
                cliente.innerText = `Cliente: ${selectClientes[index].text}`;
            } 
        }

        total.innerText = `Total: ${elementos[0].total}`;
        
    }else{
        estado.innerText = `Estado: Desocupado`;
        divDetalles.hidden = true;
    }
    
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

getClientes()
getMesas()

