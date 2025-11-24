import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarsService } from '../service/mars.service';
import { PhotoManifest } from './interface/photo-manifest';
import { catchError, debounceTime, finalize, Subject, takeUntil, tap, throwError } from 'rxjs';
import { MarsPhotos } from '../interface/mars-photos';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos.component.html',
  styleUrl: './mars-photos.component.scss'
})
export class MarsPhotosComponent implements OnInit, OnDestroy {

  constructor(private readonly marsPhotoService: MarsService, private route: ActivatedRoute) {}

  rover!: string
  manifest!: any
  earthDateValue!: string 
  solDayValue!: number 
  
  dateInput = new Subject<void>()

  cameras: string[] = []
  cameraValue!: string
  photos$: MarsPhotos[] = []
  dropdownTitle: string = 'Lista de cámaras'
  gettingCamList: boolean = false
  imgNotFoundTxt!: string
  inputFocus: boolean = false 

  errorLoadingManifest: boolean = false

  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>()
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { this.rover = params['rover'] })
    /* Se inicializa el Observable para detectar cambios en los inputs, ejecutar el método correspondiente y esperar 0.5 s entre cada llamada */
    this.dateInput
      .pipe(
        debounceTime(500), 
      )
      .subscribe(() => { this.getRoverManifest() })
    
    this.getRoverManifest()
  }

  ngOnDestroy(): void {
    this.onDestroy.next()
    this.onDestroy.complete()
  }

  /* Se obtienen los datos generales del rover seleccionado */  
  getRoverManifest() {
    this.gettingCamList = true
    this.dropdownTitle = 'Obteniendo lista...'

    this.marsPhotoService.getRoverManifest(this.rover.toLowerCase())
      .pipe(
        //?-- Al ser llamado el método onDestroy, automáticamente se desuscribe del Observable, para ahorrar memoria
        takeUntil(this.onDestroy),
        tap((res: PhotoManifest) => {
          this.manifest = res
          /* Se muestra el mensaje de alerta si el manifest no retornó nada */
          if (!res) {
            this.errorLoadingManifest = true
            return
          }
          /* Limpia los arrays si ninguna de las fechas tiene valor */
          if (!this.earthDateValue && !this.solDayValue) {
            this.cameras = []
            this.photos$ = []
            return
          }
          /* Se filtran los resultados según el tipo de fecha ingresada, si existe se asigna la lista al arreglo */
          const dateData = res.photos.find((p: any) =>
            this.solDayValue ? p.sol === this.solDayValue : p.earth_date === this.earthDateValue
          )
          this.cameras = dateData ? dateData.cameras : []
        }),
        catchError(error => {
          this.errorLoadingManifest = true
          return throwError(() => error)
        }),
        finalize(() => {
          this.gettingCamList = false
          this.dropdownTitle = 'Lista de cámaras'
        })
      )
      .subscribe()
  }

  /* Controla los cambios en los inputs, se limpia la lista de cámaras, resetea los valores y dispara la actualización del manifest */
  onSolDateChange() {
    this.earthDateValue = '', this.cameras = []    
    this.dropdownTitle = 'Lista de cámaras'
    this.dateInput.next()
  }

  onEarthDateChange() {
    this.solDayValue = 0, this.cameras = []
    this.dropdownTitle = 'Lista de cámaras'
    this.dateInput.next()
  }

  /* Para validar si los valores ingresados no exceden el límite obtenido del manifest */
  solDayValidation!: boolean 
  earthDateValidation!: boolean
  martianDatePrevention(event: any) {
    let length = event.target.value.length
    this.solDayValidation = event.target.value > this.manifest.max_sol ? (event.target.value = event.target.value.slice(0, length - 1), false) : true    
    this.dateInput.next()
  }
  earthDatePrevention(event: any) { 
    let length = event.target.value.length
    this.earthDateValidation = event.target.value > this.manifest.max_date ? (event.target.value = event.target.value.slice(0, length - 1), false) : true    
    this.dateInput.next()
  }

  /* Obtiene el valor seleccionado en la lista de cámaras y se obtienen las imágenes */
  onListClick(index: number) {
    this.photos$ = []
    this.cameraValue = this.cameras[index]

    this.getPhotosList()  
  }

  /* Se obtienen las imágenes tomadas por la cámara seleccionada de acuerdo al día solar o fecha terrestre */  
  getPhotosList() {
    const isEarthDate = this.solDayValue === 0    
    const photos$ = this.marsPhotoService.getPhotos(this.rover, this.cameraValue, isEarthDate 
      ? { earth_date: this.earthDateValue } : { sol: this.solDayValue }
    )
    photos$
      .pipe(
        catchError(error => throwError(() => error)),
        takeUntil(this.onDestroy),
        tap((res: MarsPhotos[]) => {
          this.photos$ = res;
          if (res.length === 0) {
            this.imgNotFoundTxt = `\u{f05e} ${environment.notFoundText}`
          }
        })
      )
      .subscribe();
  }
}