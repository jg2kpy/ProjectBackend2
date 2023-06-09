import API from "./API.js";

export default class ManipulacionDOM {

    constructor(agregarForm, tablaBody, divEditarForm, editarForm, API_URL, funcComp) {

        this.tablaBody = tablaBody;

        this.agregarForm = agregarForm;
        this.divEditarForm = divEditarForm;
        this.editarForm = editarForm;

        this.funcComp = funcComp;

        this.api = new API(API_URL);

        this.agregarEventerListeners();
    }

    agregarEventerListeners() {

        this.agregarForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            let DTO = {};

            let fields = Array.from(this.agregarForm.querySelectorAll("input"));
            fields.forEach((field) => {
                DTO[field.id] = field.value;
            })

            console.log("Agregando elemento:", DTO);
            const resultado = await this.api.agregarElemento(DTO);
            if (resultado) {
                console.log("Elemento agregado:", resultado);
                this.agregarForm.reset();
                this.refrescarTabla();
            }else{
                console.log("Error al agregar elemento");
                alert("No se pudo agregar el elemento");
            }
        })

        this.editarForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            let DTO = {};

            let fields = Array.from(this.editarForm.querySelectorAll("input"));
            fields.forEach((field) => {
                DTO[field.id] = field.value;
            })

            console.log("Actualizando elemento:", DTO);
            const resultado = await this.api.actualizarElemento(DTO["id"], DTO);
            if (resultado) {
                console.log("Elemento actualizado:", resultado);
                this.ocultarEditarFormulario();
                this.refrescarTabla();
            }else{
                console.log("Error al editar elemento");
                alert("No se pudo editar el elemento");
            }
        })
    }

    async refrescarTabla() {
        console.log("Refrescando tabla");
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
            if (elemento[key] !== null) {
                const td = document.createElement("td")
                const value = elemento[key]

                td.textContent = value

                fila.appendChild(td)
            } 
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
        this.divEditarForm.style.display = "block";

        Object.keys(elemento).forEach((key) => {
            const field = this.editarForm.elements[key];
            if (field !== undefined) {
                field.value = elemento[key];    
            }
        })

    }

    ocultarEditarFormulario() {
        this.editarForm.reset();
        this.divEditarForm.style.display = "none";
    }

    async eliminarElementoClick(elemento) {
        const confirmacion = confirm(`¿Desea eliminar el elemento ${elemento.id}?`);
        if (confirmacion) {
            console.log("Eliminando elemento:", elemento);
            const respuesta = await this.api.eliminarElemento(elemento.id);
            if (!respuesta) {
                console.log("Error al eliminar elemento");
                alert("No se pudo eliminar el elemento");
            } else {
                console.log("Elemento eliminado:", elemento);
            }
            this.refrescarTabla();
        }
    }
}
