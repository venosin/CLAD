// Importación del archivo principal de la aplicación Express
import app from "./app.js"; 

// Importación de la configuración de la base de datos (mongoose, conexión, etc.)
import "./database.js"; 

// Importación de las configuraciones del servidor (puerto, variables de entorno, etc.)
import { config } from "./src/config.js";

/**
 * Función principal que inicia el servidor
 * Se encarga de poner en funcionamiento la aplicación en el puerto configurado
 */
async function main() {     
    // Inicia el servidor Express en el puerto especificado en la configuración
    app.listen(config.server.PORT);     
    
    // Mensaje de confirmación que indica que el servidor está ejecutándose
    console.log("server runing", config.server.PORT);

}  

// Ejecuta la función principal para iniciar el servidor
main();