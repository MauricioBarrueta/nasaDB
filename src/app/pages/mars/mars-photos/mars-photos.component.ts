import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarsService } from '../service/mars.service';
import { Rover } from './interface/photo-manifest';
import { catchError, finalize, Subject, takeUntil, tap, throwError } from 'rxjs';
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
  solDateValue!: number
  earthDateValue!: string 
  cameraValue!: string
  photos$: MarsPhotos[] = []
  notFoundText!: string

  twinsCameras: string[] = ['FHAZ: Front Hazard Avoidance Camera', 'RHAZ: Rear Hazard Avoidance Camera', 'NAVCAM: Navigation Camera',
    'PANCAM: Panoramic Camera', 'MINITES: Miniature Thermal Emission Spectrometer (Mini-TES)']
  twinsCamerasParams: string[] = ['fhaz', 'rhaz', 'navcam', 'pancam', 'minites']

  curiosityCameras: string[] = ['FHAZ: Front Hazard Avoidance Camera', 'RHAZ: Rear Hazard Avoidance Camera', 'MAST: Mast Camera',
    'CHEMCAM: Chemistry and Camera Complex', 'MAHLI: Mars Hand Lens Imager', 'MARDI: Mars Descent Imager', 'NAVCAM: Navigation Camera']
  curiosityCamerasParams: string[] = ['fhaz', 'rhaz', 'mast', 'chemcam', 'mahli', 'mardi', 'navcam']

  allowClick!: boolean

  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>();
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { this.rover = params['rover'] })
    this.getRoverManifest()
  }

  ngOnDestroy(): void {
    this.onDestroy.next()
    this.onDestroy.complete()
  }

  /* Se obtienen los datos generales del rover seleccionado */
  getRoverManifest() {
    this.marsPhotoService.getRoverManifest(this.rover.toLowerCase())
    .pipe(
      catchError(error => {        
        return throwError(() => error)
      }),
      //?-- Al ser llamado el método onDestroy, automáticamente se desuscribe del Observable, para ahorrar memoria
      takeUntil(this.onDestroy),
      tap((res: Rover) => {
        this.manifest = res
      })
    )
    .subscribe()
  } 

  /* Se valida si el valór ingresado se encuentra dentro del rango de fechas (terrestre y marciana) */
  validSolDate!: boolean 
  validEarthDate!: boolean
  martianDatePrevention(event: any) {
    let length = event.target.value.length
    this.validSolDate = event.target.value > this.manifest.max_sol ? (event.target.value = event.target.value.slice(0, length - 1), false) : true    
  }
  earthDatePrevention(event: any) { 
    let length = event.target.value.length;
    this.validEarthDate = event.target.value > this.manifest.max_date ? (event.target.value = event.target.value.slice(0, length - 1), false) : true    
  }

  /* Obtiene el valor seleccionado en la lista desplegable y lo asigna a la variable */
  errorMessage!: string
  onDropdownClick(item: string, index: number) {
    this.photos$ = []
    this.cameraValue = this.rover === 'curiosity' ? this.curiosityCamerasParams[index] : this.twinsCamerasParams[index]

    if(this.solDateValue === -1 && this.earthDateValue === '' || this.solDateValue === undefined && this.earthDateValue === undefined) {
      this.errorMessage = 'Oops! Al parecer no has ingresado ninguna fecha o día marciano, ingresa un valor e inténtalo de nuevo.'
    } else {
      this.errorMessage = ''
      this.allowClick = true
      //* Valida cúal de las funciones se va a llamar dependiendo el valor de las variables de fecha
      this.solDateValue === -1 ? this.getPhotosByDateCam() : this.getPhotosBySolCam()
    }    
  }

  /* Muestra las imágenes tomadas de acuerdo a la fecha terrestre ingresada y a la cámara seleccionada */
  getPhotosByDateCam() {
    this.marsPhotoService.getPhotosByEarthDate(this.rover, this.earthDateValue, this.cameraValue)
      .pipe(
        catchError(error => {
          return throwError(() => error)
        }),
        //?-- Al ser llamado el método onDestroy, automáticamente se desuscribe del Observable, para ahorrar memoria
        takeUntil(this.onDestroy),
        tap((res: MarsPhotos[]) => {
          this.photos$ = res
          if(res.length === 0) this.notFoundText = `\u{f05e} ${environment.notFoundText}`        
        }),
        //?-- Se llama al finalizar el Observable, ya sea error o no
        finalize(() => { this.allowClick = false })
      )
      .subscribe()    
  }

  /* Muestra las imágenes tomadas de acuerdo a la fecha marciana ingresada y a la cámara seleccionada */
  getPhotosBySolCam() {
    this.marsPhotoService.getPhotosBySolDate(this.rover, this.solDateValue, this.cameraValue)
      .pipe(
        catchError(error => {
          return throwError(() => error)
        }),
        //? -- Al ser llamado el método onDestroy, automáticamente se desuscribe del Observable, para ahorrar memoria
        takeUntil(this.onDestroy),
        tap((res: MarsPhotos[]) => {
          this.photos$ = res
          if(res.length === 0) this.notFoundText = `\u{f05e} ${environment.notFoundText}` 
        }),
        //?-- Se llama al finalizar el Observable, ya sea error o no
        finalize(() => { this.allowClick = false })
      )
      .subscribe()
  }
}
