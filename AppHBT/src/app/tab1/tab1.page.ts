import { Component } from '@angular/core';
import { FileHandlerService } from '../services/file-handler.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  nombre: string = ''
  cantidad: string = ''
  fechapago: string = ''

  private subscription: Subscription;

  constructor(
    private router: Router,
    private fileHandlerService: FileHandlerService,
    private alertController: AlertController,
    private authService: AuthService,
  ) {
    this.subscription = this.authService.usuarioLogueado$.subscribe(
      (estado: boolean) => {
        if (!estado) {
        }
      }
    )
  }

  async guardarDatos() {
    if (this.isFormValid()) {

      const nombreM =
      this.nombre.charAt(0).toUpperCase() + this.nombre.slice(1);

      const datosAGuardar = `${nombreM},${this.cantidad},${this.fechapago}`;
      await this.fileHandlerService.guardarEnArchivo(datosAGuardar);
      this.mostrarAlerta('Registro De Pago', 'Exitoso.');


      // Con Base de datos
      // const datoss = new FormData();
      // datoss.append("nombre", this.nombre)
      // datoss.append("cantidad", this.cantidad,)
      // datoss.append("fechaPago", this.fechapago)

      // const suscripcionData = {
      //   nombre: this.nombre,
      //   cantidad: this.cantidad,
      //   fechapago: this.fechapago,
      // };
      // this.registerService.guardarDatos(datoss).subscribe(
      //   (response) => {
      //     console.log('Guardado con éxito', response);
      //     // Puedes redirigir al usuario a una página de confirmación o hacer cualquier otra acción necesaria.
      //   },
      //   (error) => {
      //     console.error('Error al guardar', error);
      //     // Maneja errores si es necesario.
      //   }
      // );

    // API RES 
    //   var endpoint = 'http://localhost:8080/pagos/guardar';

    // fetch(endpoint, {
    //   method: 'POST',
    //   mode: 'cors',
    //   headers: { 'Content-type': 'application/json' },
    //   body: JSON.stringify({
    //     nombre: this.nombre,
    //     cantidad: this.cantidad,
    //     fechapago: this.fechapago,
    //   }),
    // })
    //   .then((response) => {
    //     console.log('Guardado con exito', response);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });


    this.clearFields();
    }else {
      this.mostrarAlerta('Error', 'Por favor completa todos los campos.');
    }this.fileHandlerService.datosGuardados.emit();
  }

  isFormValid(): boolean {
    // Verifica si todos los campos del formulario están llenos.
    return (
      this.nombre.trim() !== '' &&
      this.cantidad.trim() !== '' &&
      this.fechapago.trim() !== ''
    );
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  clearFields() {
    this.nombre = '';
    this.cantidad = '';
    this.fechapago = '';
  }



  cerrarSesion() {
    this.authService.cerrarSesion();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
