import { Component } from '@angular/core';
import { FileHandlerService } from '../services/file-handler.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  nombreABuscar: string = '';
  resultadosBusqueda: string[] = [];

  constructor(private fileHandlerService: FileHandlerService) {}

  async buscarPorNombre() {
    try {
      if (this.nombreABuscar.trim() !== '') {
        const historialCompleto = await this.fileHandlerService.leerArchivo('HBTDatos.txt');

        const nombreBusqueda = this.nombreABuscar.toLowerCase();

        this.resultadosBusqueda = historialCompleto.filter(pago => {
          const pagoNombre = pago.split(',')[1].toLowerCase();
          return pagoNombre.includes(nombreBusqueda);
        });
      } else {
        this.resultadosBusqueda = [];
      }
    } catch (error) {
      console.error('Error al buscar por nombre:', error);
    }
  }
}
