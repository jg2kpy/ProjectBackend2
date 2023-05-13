export default class API {

    constructor(API_URL) {
        this.API_URL = API_URL;
    }

    //Función para obtener los elementos de la API
    async obtenerElementos() {
        try {
            const response = await fetch(this.API_URL);
            const elementos = await response.json();
            return elementos;
        } catch (error) {
            console.error(error);
        }
    }

    // Función para agregar un elemento a la API
    async agregarElemento(elemento) {
        try {
            const response = await fetch(this.API_URL, {
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

    // Función para eliminar un elemento de la API
    async eliminarElemento(id) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: "DELETE"
            });
            //como nuestro servidor no retorna nada al actualizar, retorno true
            //const data = await response.json();
            //return data;
            return true;
        } catch (error) {
            console.error(error);
        }
    }

    // Función para actualizar un cliente en la API
    async actualizarElemento(id, elementoDTO) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(elementoDTO)
            });
            //como nuestro servidor no retorna nada al actualizar, retorno true
            //const data = await response.json();
            //return data;
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
