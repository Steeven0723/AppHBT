import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost/AppHBT/src/app/conexion/BD.php';

  constructor(private http: HttpClient) {}
    
    guardarDatos(data: any) {
      return this.http.post(this.apiUrl, data)
    }
  }

