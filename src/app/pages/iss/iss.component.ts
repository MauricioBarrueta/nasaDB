import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { IssService } from './service/iss.service';
import { catchError, EMPTY, Subject, takeUntil, tap, timer } from 'rxjs';
import { Iss } from './interface/iss';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-iss',
    templateUrl: './iss.component.html',
    styleUrl: './iss.component.scss',
    standalone: false
})
export class ISSComponent implements OnInit, OnDestroy {  
  
  constructor(private issService: IssService, @Inject(PLATFORM_ID) private platformId: Object) {}   

  lat: number | null = null
  lon: number | null = null
  vel!: number | string
  latText!: string 
  lonText!: string 
  src: string = ''  

  alertText: boolean = false
  
  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>()
  
  ngOnInit(): void {
    /* Evita ejecutar la actualización durante el renderizado SSR */
    if (isPlatformBrowser(this.platformId)) {
      timer(0, 10000) //* Ejecuta inmediatamente y luego cada 10 segundos
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          this.getIssCurrLoc()
        })
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next()
    this.onDestroy.complete()
  }

  /* Se obtiene la ubicación actual de la ISS, y se asignan al url de Google Maps para mostrarlo */  
  getIssCurrLoc() {
    this.issService.getCurrentPosition()
      .pipe(
        takeUntil(this.onDestroy),
        tap((res: Iss) => {
          this.alertText = false

          this.lat = res.latitude
          this.latText = this.lat < 0 ? 'S' : 'N'

          this.lon = res.longitude
          this.lonText = this.lon < 0 ? 'O' : 'E'

          this.vel = `${res.velocity.toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} km/h`

          this.src = `https://maps.google.com/maps?q=${this.lat},${this.lon}&t=h&z=3&hl=es&ie=UTF8&iwloc=&output=embed`
        }),
        catchError(error => {
          console.error(error)

          /* Se muestra el mensaje de error y se asignan valores por defecto a variables e imagen */
          this.alertText = true
          this.lat = null
          this.latText = 'S/D'
          this.lon = null
          this.lonText = 'S/D'
          this.vel = 'S/D'
          this.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg'

          /* Se completa inmediatamente el flujo */
          return EMPTY
        })
      )
      .subscribe()
  }
}