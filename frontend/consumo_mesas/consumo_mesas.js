// Definir la URL del servidor como una variable global
const API_URL = 'http://localhost:3000/';

// Función para realizar el logging
function logOperation(operation) {
  console.log(`Operación realizada: ${operation}`);
}

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
const generatePDFForm = document.getElementById("generatePDFForm");

let id_cabecera = 0;

async function getMesas() {
  await fetch(API_URL + 'mesas')
    .then(response => response.json())
    .then(mesas => {
      mesas.forEach(mesa => {
        selectMesas.innerHTML += `<option value="${mesa.id}">${mesa.nombre}</option>`;
      });
      logOperation('Obtener mesas');
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
      logOperation('Obtener clientes');
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
    .then(() => {
      logOperation('Desocupar mesa');
    })
    .catch(error => console.error(error));

  const buscar = {
    id_mesa: parseInt(selectMesas.value)
  }
  refrescarTabla(buscar);
})

formConfirmarReserva.addEventListener("submit", async (event) => {
  event.preventDefault();
  const pdfViewer = document.getElementById('pdfViewer');
  pdfViewer.innerHTML = '';	
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
      .then(response => response.json())
      .then(data => {
        id_cabecera = data.id;
        return data;
      })
      .catch(error => console.error(error));

    estado.innerText = `Estado: Ocupado`;
    divDetalles.hidden = false;

    cliente.innerText = `Cliente: ${selectClientes.options[selectClientes.selectedIndex].text}`;

    total.innerText = `Total: 0`;

    const buscar = {
      id_mesa: parseInt(selectMesas.value)
    }
    refrescarTabla(buscar);

    logOperation('Confirmar reserva');

  } else {
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
      .then(() => {
        logOperation('Cambiar estado a abierto');
      })
      .catch(error => console.error(error));

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
    } else {
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

  if (resultado) {
    await refrescarTabla({ id_mesa: parseInt(selectMesas.value) });
  } else {
    alert("No se pudo editar el elemento");
  }
})

async function agregarElemento(elemento) {
  try {
    const response = await fetch(API_URL + "consumo/detalle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(elemento)
    });
    const data = await response.json();
    logOperation('Agregar elemento');
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

  } else {
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
    });
    const elementos = await response.json();
    logOperation('Obtener elementos');
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


generatePDFForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Obtener los valores del formulario y otros elementos
  const nombreCliente = selectClientes.options[selectClientes.selectedIndex].text;
  const cedulaCliente = selectClientes.value;
  const numeroMesa = selectMesas.value;
  const fechaCreacion = new Date().toLocaleDateString();

  // Obtener los detalles de consumo
  const elementos = await obtenerElementos({ id_mesa: parseInt(numeroMesa) });

  // Crear la estructura del contenido del PDF
  const content = [
    { text: 'Recibo', style: 'header' },
    { text: 'Cliente: ' + nombreCliente },
    { text: 'Cédula: ' + cedulaCliente },
    { text: 'Número de Mesa: ' + numeroMesa },
    { text: 'Fecha de Creación: ' + fechaCreacion, margin: [0, 20, 0, 10] },
    { text: 'Detalles:', style: 'subheader' }
  ];

  const productos = await getProductos();

  // Agregar los detalles de consumo al contenido del PDF
  elementos[0].ConsumoDetalles.forEach(async (elemento) => {
    //obtener producto con id=elemento.id_producto del objeto productos
    const producto = productos.find(producto => producto.id === elemento.id_producto);
    const detalle = ['Producto: ' + producto.nombre, 'Cantidad: ' + elemento.cantidad, 'Precio: ' + producto.precio];
    content.push(detalle);
    content.push({ text: ' ' });
  });

  // Agregar el total al contenido del PDF
  content.push({ text: 'Total: ' + elementos[0].total, style: 'total' });

  // Definir el estilo del PDF
  const styles = {
    header: {
      fontSize: 24,
      bold: true,
      alignment: 'center',
      margin: [0, 0, 0, 10]
    },
    subheader: {
      fontSize: 18,
      bold: true,
      margin: [0, 20, 0, 10]
    },
    total: {
      fontSize: 16,
      bold: true,
      margin: [0, 20, 0, 10]
    }
  };

  // Crear el documento PDF
  const docDefinition = {
    content: content,
    styles: styles
  };

  // Generar el PDF
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  // Mostrar el PDF en el visor
  pdfDocGenerator.getDataUrl(function (dataUrl) {
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.innerHTML = '<iframe src="' + dataUrl + '" width="100%" height="500px"></iframe>';
  });
});

async function getProductos() {
  try {
    const response = await fetch(API_URL + 'productos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const productos = await response.json();
    logOperation('Obtener productos');
    return productos;
  } catch (error) {
    console.error(error);
  }
}

// Obtener las mesas y los clientes al cargar la página
getMesas();
getClientes();
