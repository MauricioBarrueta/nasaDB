import { Component, OnDestroy, OnInit } from '@angular/core';
import { IssService } from './service/iss.service';
import { catchError, EMPTY, Subject, takeUntil, tap, timeout } from 'rxjs';
import { Iss } from './interface/iss';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iss',
  templateUrl: './iss.component.html',
  styleUrl: './iss.component.scss'
})
export class ISSComponent implements OnInit, OnDestroy {  
  
  constructor(private issService: IssService, private router: Router) {}   

  lat!: number | string
  lon!: number | string
  latText!: string 
  lonText!: string 
  src!: string  

  alertText: boolean = false
  
  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>()

  ngOnInit(): void {      
    this.getIssCurrLoc() 
  }   

  ngOnDestroy(): void {
    this.onDestroy.next()
    this.onDestroy.complete()
  }

  /* Se obtiene la ubicación actual de la ISS, y se asignan al url de Google Maps para mostrarlo */
  getIssCurrLoc() {
    this.issService.getCurrentPosition()
    .pipe(
      timeout(5000),
      catchError(error => {        
        console.error(error)
        /* Se muestra el mensaje de error y se asignan valores por defecto a variables e imágen */
        this.alertText = true
        this.lat = 0, this.latText = 'S/D'
        this.lon = 0, this.lonText = 'S/D'
        this.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg'
        /* Se completa inmediatamente el flujo */
        return EMPTY
      }),
      takeUntil(this.onDestroy),
      tap((res: Iss) => {    
        this.alertText = false
        this.lat = res.latitude
        this.latText = this.lat.toString().includes('-') ? 'Sur' : 'Norte'

        this.lon = res.longitude;
        this.lonText = this.lon.toString().includes('-') ? 'Oeste' : 'Este';

        this.src = `https://maps.google.com/maps?q=${this.lat},${this.lon}&t=h&z=3&hl=es&ie=UTF8&iwloc=&output=embed`
      })
    )
    .subscribe()
  }
}