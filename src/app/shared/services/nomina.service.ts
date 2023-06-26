import { Injectable } from '@angular/core';
import { CoreService } from './core.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';





@Injectable({
  providedIn: 'root'
})
export class NominaService {
  

  constructor(
    private coreService:CoreService,
    private http: HttpClient,

  ) { }

  importarExcel(archivo: File){
    const formData = new FormData();
    formData.append('documento', archivo);
    return this.coreService.post('nomina', formData);
  }
  descargarPDF(): Observable<Blob> {
    const urlAPI = 'http://127.0.0.1:8000/api/nominaReporte';
    const headers = {
      'Content-Type': 'application/pdf',
    };
    return this.http.get(urlAPI, { headers, responseType: 'blob' });
  }

  // descargarPDF(): Observable<string> {
  //   const urlAPI = 'http://127.0.0.1:8000/api/nominaReporte'; // Reemplaza esto con la URL de tu API

  //   return this.http.get<string>(urlAPI);
  // }
}
 



