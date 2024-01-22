import { Injectable, EventEmitter } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  datosGuardados = new EventEmitter<void>();



  private idCounter: number = 1;
  async guardarEnArchivo(datos: string): Promise<void> {
    try {
      const archivo = 'HBTDatos.txt';
  
      // Verificar si el archivo existe
      const existeArchivo = await this.verificarArchivo(archivo);
  
      let contenido = '';
      if (existeArchivo) {
        // Leer el contenido del archivo existente
        const contenidoArchivo = await Filesystem.readFile({
          path: archivo,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });
  
        if (typeof contenidoArchivo.data === 'string') {
          let lineas = contenidoArchivo.data.split('\n');
          // Encontrar la ID más alta en el archivo
          let idMasAlta = 0;
          lineas.forEach(linea => {
            const registro = linea.split(',');
            const id = parseInt(registro[0]);
            if (!isNaN(id) && id > idMasAlta) {
              idMasAlta = id;
            }
          });
  
          this.idCounter = idMasAlta + 1; // Incrementar la ID basada en la más alta encontrada
          contenido = contenidoArchivo.data + '\n' + `${this.idCounter},${datos}`;
        }
      } else {
        contenido = `${this.idCounter},${datos}`; // Si el archivo no existe, guardar solo el nuevo dato
      }
  
      // Escribir o crear el archivo con el contenido actualizado
      await Filesystem.writeFile({
        path: archivo,
        data: contenido,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        recursive: true 
      });
  
      console.log('Datos guardados en:', archivo);

    } catch (error) {
      console.error('Error al guardar en archivo:', error);
    }
  }
  

  async actualizarRegistro(nombreRegistro: string, registroEditado: string): Promise<void> {
    try {
      const archivo = 'HBTDatos.txt';

      // Leer el contenido del archivo
      const contenidoArchivo = await Filesystem.readFile({
        path: archivo,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      let contenidoString = '';
      if (typeof contenidoArchivo.data === 'string') {
        contenidoString = contenidoArchivo.data;
      } else if (contenidoArchivo.data instanceof Blob) {
        contenidoString = await this.convertirBlobACadena(contenidoArchivo.data);
      }

      // Obtener un array de líneas del archivo
      const lineas = contenidoString.split('\n');

      // Encontrar el índice del registro por el nombre
      const indiceRegistro = lineas.findIndex(linea => {
        const registro = linea.split(',');
        return registro[0] === nombreRegistro;
      });

      if (indiceRegistro !== -1) {
        lineas[indiceRegistro] = registroEditado; // Reemplazar registro original por el editado
      }

      // Volver a crear el contenido como una cadena
      contenidoString = lineas.join('\n');

      // Escribir el contenido actualizado al archivo
      await Filesystem.writeFile({
        path: archivo,
        data: contenidoString,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        recursive: true
      });

      console.log('Registro actualizado en:', archivo);

      // Emitir evento de actualización de datos
      this.datosGuardados.emit();
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      throw new Error('Error al actualizar el registro.');
    }
  }


  // Método para convertir un Blob a una cadena de texto
  private async convertirBlobACadena(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const contenidoCadena = fileReader.result as string;
        resolve(contenidoCadena);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(blob);
    });
  }

  async delete(idToDelete: string): Promise<void> {
    try {
      const archivo = 'HBTDatos.txt';

      const contenidoArchivo = await Filesystem.readFile({
        path: archivo,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      let contenidoString = '';
      if (typeof contenidoArchivo.data === 'string') {
        contenidoString = contenidoArchivo.data;
      } else if (contenidoArchivo.data instanceof Blob) {
        contenidoString = await this.convertirBlobACadena(contenidoArchivo.data);
      }

      const lineas = contenidoString.split('\n');
      const nuevasLineas = lineas.filter(linea => {
        const idRegistro = linea.split(',')[0];
        return idRegistro !== idToDelete; // Filtrar las líneas, manteniendo solo las que no coincidan con el ID a eliminar
      });

      const nuevoContenido = nuevasLineas.join('\n');

      await Filesystem.writeFile({
        path: archivo,
        data: nuevoContenido,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        recursive: true
      });

      console.log('Registro eliminado en:', archivo);

      // Emitir evento de eliminación de datos
      this.datosGuardados.emit();
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw new Error('Error al eliminar el registro.');
    }
  }

  async leerArchivo(nombreArchivo: string): Promise<string[]> {
    try {
      const contenidoArchivo = await Filesystem.readFile({
        path: nombreArchivo,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      if (typeof contenidoArchivo.data === 'string') {
        // Verificar si el contenido es de tipo string antes de aplicar split
        const historial: string[] = contenidoArchivo.data.split('\n');
        return historial;
      } else {
        throw new Error('El contenido no es de tipo string.');
      }
    } catch (error) {
      throw new Error('No se pudo leer el archivo.');
    }
  }

  // Método para verificar si un archivo existe
  private async verificarArchivo(archivo: string): Promise<boolean> {
    try {
      await Filesystem.stat({
        path: archivo,
        directory: Directory.Documents
      });
      return true; // Si no se produce un error, el archivo existe
    } catch (error) {
      return false; // Si hay un error, el archivo no existe
    }
  }
}

