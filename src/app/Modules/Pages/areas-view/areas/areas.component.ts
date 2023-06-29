import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, AfterViewChecked, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { AreaModel } from 'src/app/shared/models/area.model';
import { AreaService } from 'src/app/shared/services/area.service';
import { NotificationService } from 'src/app/shared/services/notification-service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as $ from 'jquery';
import 'slick-carousel';
import { IconChartSoleComponent } from 'src/app/Modules/Components/icon-chart-sole/icon-chart-sole.component';
import { ExtendModalFormComponent } from '../../../Components/extend-modal-form/extend-modal-form.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { AreasModalComponent } from '../areas-modal/areas-modal.component';
import { ExtendModalFiller, incomeData } from 'src/app/shared/models/extend-modal-content';
import { SearchBarService } from 'src/app/shared/services/search-bar.service';
import { IconChartFiller } from 'src/app/shared/models/icon-chart.model';
import { ExtendModalAlertComponent } from 'src/app/Modules/Components/extend-modal-alert/extend-modal-alert.component';
import { BoardTable, BoardTableFiller } from 'src/app/shared/models/board-table.model';


@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit, OnDestroy {


  protected cache: Map<number, { areas: AreaModel[] | null }> = new Map<number, { areas: AreaModel[] | null }>();
  protected showFormArea: boolean = false;
  protected formTitle: string = "";
  protected showResultadoBusqueda: boolean = false;
  protected resultadoBusqueda: AreaModel | null = null;
  displayet: AreaModel[] = []
  searchTerm: string = '';
  area: AreaModel | null = null;
  view: Array<any> = [];
  soleView: IconChartFiller = {} as IconChartFiller
  private subscription: Subscription | undefined;
  filler: ExtendModalFiller[] = [];
  tableView: BoardTable = {} as BoardTable;

  constructor(
    //private dialogRef: MatDialogRef<AreasComponent>,
    //private modalRef: MatDialogRef<ExtendModalComponent>,
    private searchService: SearchBarService,
    private modal: MatDialog,
    private notificationService: NotificationService,
    private _areaService: AreaService,
  ) { }



  ngOnInit() {



    this.searchService.getModelName("area", "areas")

    this.searchService.$searchArrayService.subscribe((res: any) => {
      let view: IconChartFiller[] = res.map((res: AreaModel) => ({
        itemId: res.id || "",
        iconUrl: res.iconUrl,
        itemName: res.nombreArea,
        itemCode: res.codigo,
        itemOne: res.codigo,
        itemTwo: res.nombreArea,
        itemThree: res.nombreArea,
        itemEnfasis: res.id,
        itemMessage: "Horas"
        
      }
      ))
      let as = new Date(2022, 1, 10);
      let titles =  ["ID","Nombre de area", "Nombre de area", "Nombre de area", "Nombre de area", "Nombre de area", "Nombre de area", "Nombre de area", "Nombre de area"]
      let tableView: BoardTableFiller[] = res.map((res:AreaModel) => ({
        itemData: [res.id,res.nombreArea, res.iconUrl, res.nombreArea ,res.nombreArea, res.iconUrl, res.iconUrl, res.iconUrl, res.iconUrl],
        itemId: res.id
      }))
      this.tableView  = {itemTitles:titles, itemData : tableView}
      this.view = view;
      this.soleView = view[0]

      
    });

    
  }

  Update(data: IconChartFiller) {
    console.log("lo que trae el coso", data);

    this.filler = [{
      fieldName: "Nombre de Area",
      type:"input",
      control: "text",
      dataPlacer: data.itemName,
      uppercase: true
    }
      , {
      fieldName: "Codigo",
      control: "number",
      dataPlacer: data.itemOne
    },
    {
      fieldName: "Icono asdasd asd aqwe ",
      control: "string",
      dataPlacer: data.iconUrl
    },
    {
      fieldName: "Icaono",
      type: "input",
      control: "date"
    }
    ]

    var pass: incomeData = {
      filler: this.filler, title: "Actualizar area"
    }

    const dialogRef: MatDialogRef<ExtendModalFormComponent> = this.modal.open(ExtendModalFormComponent, { data: pass })
    
    
    dialogRef.afterClosed().subscribe(gets => {
      if (gets) {
        this.area = {
          id: data.itemId,
          nombreArea: gets[0],
          codigo: gets[1]
        }
        this.guardarArea(this.area)

        this.searchService.getModelName("area", "areas")
        console.log("view", this.view);



      }
    })
  }


  async showAlert(alert: string): Promise<boolean> {
    const dialogRef: MatDialogRef<ExtendModalAlertComponent> = this.modal.open(ExtendModalAlertComponent, { data: alert });
  
    return await dialogRef.afterClosed().toPromise();
  }

  Delete(data: { itemId: number, itemName: string }) {

    this.showAlert("¿Desea borrar : " + data.itemName + "?").then((response: boolean) => {
      if (response) {
        this.deleteArea(data.itemId);
        this.searchService.getModelName("area", "areas");
        this.notificationService.showNotification({ message: "Cambios guardados", type: "success" })

      }
    });


  }

  guardarArea(area: AreaModel) {

    this.notificationService.showNotification({ message: "Cambios guardados", type: "success" })

    if (area.id) {
      this._areaService.actualizarArea(area).subscribe(() => {


      });
    } else {
      this._areaService.guardarArea(area).subscribe(() => {


      });
    }
  }




  iniciarCache() {
    this.cache.set(0, { areas: null });
  }



  getAreas() {


  }


  deleteArea(event: number) {
    this._areaService.borrarArea(event).subscribe(() => {
      this.getAreas();

    })
  }
  ///////////////////////////////

  dialogConfig = new MatDialogConfig();


  openModalCreate() {
    this.filler = [{
      fieldName: "Nombre de Area",
      control: "text",
      uppercase: true
    }
      , {
      fieldName: "Codigo",
      control: "number",
    },
    {
      fieldName: "Icono",
      control: "string",
    }]

    var pass: incomeData = {
      filler: this.filler, title: "Actualizar area", update: true
    }

    const dialogRef: MatDialogRef<ExtendModalFormComponent> = this.modal.open(ExtendModalFormComponent, { data: pass })
    dialogRef.afterClosed().subscribe(gets => {
      if (gets) {
        this.area = {
          nombreArea: gets[0],
          codigo: gets[1],
          iconUrl: gets[2]
        }
        console.log(this.area);

        this.guardarArea(this.area)

        this.searchService.getModelName("area", "areas")
        console.log("view", this.view);



      }
    })




  }


  /////////////////////////////////////////////





  buscarArea(event: AreaModel) {
    this.showResultadoBusqueda = true;
    this.resultadoBusqueda = event;
  }




  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



  ngAfterViewChecked(): void {

  }
}