import { Component, OnInit } from '@angular/core';
import { FileHandlerService } from '../services/file-handler.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  historialPagos: string[] = [];

  constructor(
    private fileHandlerService: FileHandlerService,
    private router : Router,
    private alertController: AlertController
    ) {
    this.fileHandlerService.datosGuardados.subscribe(() => {
      this.cargarHistorialPagos();
    });
  }

  ngOnInit() {
    this.cargarHistorialPagos();
  }

  async cargarHistorialPagos() {
    try {
      this.historialPagos = await this.fileHandlerService.leerArchivo('HBTDatos.txt');
    } catch (error) {
      console.error('Error al cargar el historial de pagos:', error);
    }
  }

  edit(datos: string) {
    this.router.navigate(['edit'], { state: { datos } });
  }

  async delete(pago: string) {
    const idToDelete = pago.split(',')[0]; // Obtener el ID del pago a eliminar

    const confirmAlert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar este pago?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Acción cancelada
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              // Eliminar el pago utilizando el servicio FileHandlerService
              await this.fileHandlerService.delete(idToDelete);
              // Actualizar la lista después de la eliminación
              await this.cargarHistorialPagos();
            } catch (error) {
              console.error('Error al eliminar el pago:', error);
            }
          }
        }
      ]
    });

    await confirmAlert.present();
  }

  async mostrarConfirmacion(titulo: string, mensaje: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            return false;
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            return true;
          }
        }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'Eliminar';
  }
}
