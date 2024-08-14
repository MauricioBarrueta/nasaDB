import { Component, OnDestroy, OnInit } from '@angular/core';
import { APODService } from './service/apod.service';
import { catchError, Subject, takeUntil, tap, throwError } from 'rxjs';
import { APOD } from './interface/apod';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrl: './apod.component.scss'
})

export class APODComponent implements OnInit, OnDestroy {

  constructor(private apodService: APODService, private router: Router, private datePipe: DatePipe) { }

  apod$!: APOD
  date!: any
  mediaType!: string //* Para validar si es imagen o video
  mediaVideoUrl!: string

  title: string = ''

  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>();
  
  ngOnInit(): void {     
    //* Se obtiene la fecha actual con el formato especificado
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getPictureOfTheDay()       
  }

  ngOnDestroy(): void {
    this.onDestroy.next()
    this.onDestroy.complete()
  }

  /* Se obtiene la imagen astronómica del día */
  getPictureOfTheDay() {
    this.router.navigate(['astronomy/picture-of-the-day'])

    this.apodService.getPictureOfTheDay(this.date)
    .pipe(
      catchError(error => {        
        return throwError(() => error)
      }),
      //? -- Al ser llamado el método onDestroy, automáticamente se desuscribe del Observable, para ahorrar memoria
      takeUntil(this.onDestroy),
      tap((res: APOD) => {
        this.apod$ = res
        this.mediaType = this.apod$.media_type    
        this.title = this.mediaType !== 'video' ? 'Esta es la imagen astronómica del día de hoy'
          : 'Este es el video astronómico del día de hoy'     
        this.mediaVideoUrl = `${this.apod$.url}?autoplay=1&mute=1&enablejsapi=1`
      })
    )
    .subscribe()    
  }

}
