import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de importar correctamente el servicio

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['tabs']); // Redirecciona a la página principal después del inicio de sesión exitoso
    } else {
      this.errorMessage = 'Credenciales incorrectas. Por favor, intenta de nuevo.';
    }
  }
}
