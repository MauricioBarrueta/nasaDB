import { Component, OnDestroy, OnInit } from '@angular/core';
import { APODService } from './service/apod.service';
import { catchError, Subject, takeUntil, tap, throwError } from 'rxjs';
import { APOD } from './interface/apod';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrl: './apod.component.scss'
})

export class APODComponent implements OnInit, OnDestroy {

  constructor(private readonly apodService: APODService, private router: Router) {}

  apod$!: APOD
  mediaType!: string //* Para validar si es imagen o video
  mediaVideoUrl!: string

  title: string = ''

  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>();
  
  ngOnInit(): void { 
    this.router.navigate(['astronomy/picture-of-the-day'])
    this.getPictureOfTheDay()       
  }

  ngOnDestroy(): void {
    this.onDestroy.next()
    this.onDestroy.complete()
  }

  /* Se obtiene la imagen astronómica del día */
  getPictureOfTheDay() {
    this.apodService.getPictureOfTheDay()
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
