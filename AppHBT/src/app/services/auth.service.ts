import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  private usuarioLogueado: boolean = false;
  usuarioLogueado$ = new Subject<boolean>();

  constructor(private router: Router) {}

  // Simular credenciales (esto puede ser reemplazado con una autenticación real)
  username = 'admin';
  password = '123456';


  login(user: string, pass: string): boolean {
    if (user === this.username && pass === this.password) {
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  estaAutenticado(): boolean {
    return this.usuarioLogueado;
  }

  cerrarSesion(): void {
    // Lógica para cerrar la sesión...

    this.usuarioLogueado = false;
    this.usuarioLogueado$.next(false); // Emitir un evento de cierre de sesión
    this.router.navigate(['login']); // Redirigir a la página de inicio de sesión
  }
}
