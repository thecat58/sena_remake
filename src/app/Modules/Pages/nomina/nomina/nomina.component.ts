import { Component } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification-service';
import { NominaService } from 'src/app/shared/services/nomina.service';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.css']
})
export class NominaComponent {
  progreso: number = 0;
  cargandoArchivo = false;
  errorOccurred = true;
  uploadingFile: boolean | undefined;
  fileToUpload: null | undefined;

  constructor(
    private _uiNotificationService: NotificationService,
    private _importarExcel: NominaService,
    private _descargarPDF:NominaService,
    private http: HttpClient
  ) { }


  importarDocumetosMora(event:any) {
    event.preventDefault();
    this.uploadingFile = true;
    this.errorOccurred = false;
    this.cargandoArchivo = true;
    const archivo = event.target.documento.files[0];
    const reader = new FileReader();

    reader.onloadstart = () => {
      this.progreso = 0;
    };
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        this.progreso = Math.round((event.loaded / event.total) * 50);
      }
    };
    this._importarExcel.importarExcel(archivo).subscribe(
      response => {
        console.log(response);
        this._uiNotificationService.showNotification({message:"Ok! importación completada, ejecute el procedimiento", type: "success"});
        this.cargandoArchivo = false;

      },
      error => {
        console.log(error);
        this._uiNotificationService.showNotification({message:"Upps! Ocurrio un error", type:"fail"});
        this.cargandoArchivo = false;
      }
    );
    reader.readAsDataURL(archivo);
  }

  refreshPage() {
    location.reload();
  }



  descargar(): void {
    this._descargarPDF.descargarPDF().subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'archivo.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }





}
