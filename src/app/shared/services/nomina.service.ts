import { Injectable } from '@angular/core';
import { CoreService } from './core.service';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class NominaService {

  constructor(
    private _coreService:CoreService,

  ) { }

  importarExcel(archivo: File){
    const formData = new FormData();
    formData.append('documento', archivo);
    return this._coreService.post('nomina', formData);
  }

  descargarPDF(): Observable<Blob> {
    const urlAPI = 'http://127.0.0.1:8000/api/nominaReporte';
    const headers = {
      'Content-Type': 'application/pdf',
    };
    return this._coreService.get(urlAPI, { headers, responseType: 'blob' });
  }


}
