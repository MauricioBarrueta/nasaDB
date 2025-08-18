import { Component, OnDestroy, OnInit } from '@angular/core';
import { EpicService } from './service/epic.service';
import { catchError, of, Subject, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { Epic } from './interface/epic';
import { environment } from '../../../environments/environment.development';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-epic',
  templateUrl: './epic.component.html',
  styleUrl: './epic.component.scss'
})
export class EpicComponent implements OnInit, OnDestroy {

  constructor(private epicService: EpicService, private datePipe: DatePipe) { }

  epic$: Epic[] = []
  imageData$: any[] = []
  dateQuery!: string
  dateParam: any

  alertText: boolean = false

  ngOnInit(): void {
    var date = new Date()    
    date.setDate(date.getDate() - 1) // Para obtener la fecha anterior a la actual, el URL de la API así lo requiere*
    var prevDate = date.toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
    this.dateParam = this.datePipe.transform(prevDate, 'yyyy-MM-dd')
    
    this.getImagesAndData()
  }

  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>();
  ngOnDestroy(): void {
    this.onDestroy.next()
    this.onDestroy.complete()
  }  

  /* Obtiene las imágenes para la fecha actual, en caso de no regrese ningún resultado, carga las últimas disponibles */
  getImagesAndData() {
    this.epicService.getImagesByDate(this.dateParam)
      .pipe(
        catchError(error => throwError(() => error)),
        takeUntil(this.onDestroy),
        switchMap((res: Epic[]) => {
          /* Si no se encontraron imagenes en la fecha actual se obtienen las últimas disponibles */
          if (!res.length) {
            this.alertText = true
            return this.epicService.getLastImages()
          } else {
            this.alertText = false
            return of(res)
          }
        }),
        tap((res: Epic[]) => {
          this.epic$ = res
          this.photoData(this.epic$)
        })
      )
      .subscribe()
  }

  /* Se pasan los datos obtenidos al array imageData$ */
  photoData(array: Epic[]) {
    this.imageData$ = []
    array.forEach(photo => {
      const date = photo.date.substring(0, 10).split('-').join('/'); /* YYYY/mm/dd */
      this.dateQuery = date

      this.imageData$.push({
        src: `${environment.epicImgUrl}/${date}/png/${photo.image}.png`,
        date: photo.date,
        lat: photo.coords.dscovr_j2000_position.y,
        lon: photo.coords.dscovr_j2000_position.x,
        caption: photo.caption
      })
    })
  }
}