
export async function obtenerElementos(API_URL) {
    try {
        const response = await fetch(API_URL);
        const elementos = await response.json();
        return elementos;
    } catch (error) {
        console.error(error);
    }
}
