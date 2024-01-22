import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileHandlerService } from '../services/file-handler.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage {

  datos: any = {
    id: '',
    nombre: '',
    cantidad: '',
    fechaPago: '',
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private fileHandlerService: FileHandlerService
    ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && 'state' in navigation.extras) {
      const state = navigation.extras.state;
      if (state && 'datos' in state) {
        this.datos = state['datos'].split(',');
        this.datos.id = this.datos[0];
        this.datos.nombre = this.datos[1];
        this.datos.cantidad = this.datos[2];
        this.datos.fechaPago = this.datos[3];
      }
    }
  }


  guardarCambios() {
    const registroEditado = `${this.datos.id},${this.datos.nombre},${this.datos.cantidad},${this.datos.fechaPago}`;
    
    // Lógica para actualizar el registro en tu almacenamiento (datos.txt)
    this.fileHandlerService.actualizarRegistro(this.datos.id, registroEditado)
      .then(() => {
        // Redirigir a la página de listado (Tab2Page) después de guardar cambios
        this.mostrarAlerta('Actualizacion', 'Exitosa.');
      })
      .catch((error) => {
        console.error('Error al actualizar el registro:', error);
        // Manejar errores aquí
      });
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
