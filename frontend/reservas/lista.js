const API_URL = 'http://localhost:3000/';

const tablaBody = document.getElementById("tabla-body");

async function refrescarTabla() {

    const elementos = await obtenerElementos();

    elementos.forEach((elemento) => {
        elemento.desde = elemento.rangos_de_hora[0].substring(0,2)
        elemento.hasta = elemento.rangos_de_hora[elemento.rangos_de_hora.length - 1].substring(3)
        delete elemento.rangos_de_hora
    });

    tablaBody.innerHTML = "";

    elementos.forEach((elemento) => {
        const fila = this.crearFila(elemento);
        tablaBody.appendChild(fila);    
    });
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

async function obtenerElementos() {
    try {
        const response = await fetch(API_URL + 'reservas/', {
            method: "GET"
        }
        );
        const elementos = await response.json();
        return elementos;
    } catch (error) {
        console.error(error);
    }
}

$(document).ready(async function () {
    await refrescarTabla()
    // Setup - add a text input to each footer cell
    $('#lista tfoot th').each(function () {
        var title = $(this).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });
 
    // DataTable
    var table = $('#lista').DataTable({
        "order": [[ 4, 'asc' ], [ 8, 'asc' ], [ 3, 'asc' ]],
        initComplete: function () {
            // Apply the search
            this.api()
                .columns()
                .every(function () {
                    var that = this;
 
                    $('input', this.footer()).on('keyup change clear', function () {
                        if (that.search() !== this.value) {
                            that.search(this.value).draw();
                        }
                    });
                });
        },
    });
});
