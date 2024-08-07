import { AfterContentChecked, AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { IssService } from './service/iss.service';
import { catchError, Subject, takeUntil, tap, throwError } from 'rxjs';
import { Iss } from './interface/iss';
import { setInterval } from 'timers';

@Component({
  selector: 'app-iss',
  templateUrl: './iss.component.html',
  styleUrl: './iss.component.scss'
})
export class ISSComponent implements OnInit, OnDestroy {  
  
  constructor(private issService: IssService) {}   

  lat!: number
  lon!: number
  latText!: string 
  lonText!: string 
  src!: string  
  
  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>();
  
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
      catchError(error => {        
        return throwError(() => error)
      }),
      //? -- Al ser llamado el método onDestroy, automáticamente se desuscribe del Observable, para ahorrar memoria
      takeUntil(this.onDestroy),
      tap((res: Iss) => {    
        this.lat = res.latitude  
        this.latText = this.lat.toString().includes('-') ? 'Sur' : 'Norte'

        this.lon = res.longitude
        this.lonText = this.lon.toString().includes('-') ? 'Oeste' : 'Este'

        this.src = `https://maps.google.com/maps?q=${this.lat},${this.lon}&t=h&z=2&hl=es&ie=UTF8&iwloc=&output=embed`
      })
    )
    .subscribe()    
  }  
}

