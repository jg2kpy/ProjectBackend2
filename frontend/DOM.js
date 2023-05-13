import API from "./API.js";

export default class DOM {

    constructor(formulario, tablaBody, editarFormulario, editarForm, API_URL, funcComp) {

        this.tablaBody = tablaBody;

        this.formulario = formulario;
        this.editarFormulario = editarFormulario;
        this.editarForm = editarForm;

        this.funcComp = funcComp;

        this.api = new API(API_URL);

        this.agregarEventerListeners();
    }

    agregarEventerListeners() {

        this.formulario.addEventListener("submit", async (event) => {
            event.preventDefault();

            let DTO = {};

            let fields = Array.from(this.formulario.querySelectorAll("input"));
            fields.forEach((field) => {
                DTO[field.id] = field.value;
            })

            const resultado = await this.api.agregarElemento(DTO);
            if (resultado) {
                this.formulario.reset();
                this.refrescarTabla();
            }
        })

        this.editarForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            let DTO = {};

            let fields = Array.from(this.editarForm.querySelectorAll("input"));
            fields.forEach((field) => {
                DTO[field.id] = field.value;
            })

            const resultado = await this.api.actualizarElemento(DTO["id"], DTO);
            if (resultado) {
                this.ocultarEditarFormulario();
                this.refrescarTabla();
            }
        })
    }

    async refrescarTabla() {
        const elementos = await this.api.obtenerElementos();

        this.tablaBody.innerHTML = "";

        elementos.sort(this.funcComp);

        elementos.forEach((elemento) => {
            const fila = this.crearFila(elemento);
            this.tablaBody.appendChild(fila);
        });
    }

    crearFila(elemento) {
        const fila = document.createElement("tr");

        Object.keys(elemento).forEach((key) => {
            const td = document.createElement("td")
            const value = elemento[key]

            if (isNaN(Date.parse(value))) {
                td.textContent = value
            } else {
                td.textContent = new Date(value).toLocaleDateString();
            }

            fila.appendChild(td)
        })

        const acciones = document.createElement("td");

        const editarBoton = document.createElement("button");
        editarBoton.textContent = "Editar";
        editarBoton.addEventListener("click", () => this.mostrarEditarFormulario(elemento));
        acciones.appendChild(editarBoton);

        const eliminarBoton = document.createElement("button");
        eliminarBoton.textContent = "Eliminar";
        eliminarBoton.addEventListener("click", () => this.eliminarElementoClick(elemento));
        acciones.appendChild(eliminarBoton);
        fila.appendChild(acciones);

        return fila
    }

    mostrarEditarFormulario(elemento) {
        // habilito el display del form
        this.editarFormulario.style.display = "block";

        Object.keys(elemento).forEach((key) => {
            const field = this.editarForm.elements[key];
            field.value = elemento[key];
        })

    }

    ocultarEditarFormulario() {
        this.editarForm.reset();
        this.editarFormulario.style.display = "none";
    }

    async eliminarElementoClick(elemento) {
        const confirmacion = confirm(`¿Desea eliminar el elemento ${elemento.id}?`);
        if (confirmacion) {
            await this.api.eliminarElemento(elemento.id);
            this.refrescarTabla();
        }
    }
}
