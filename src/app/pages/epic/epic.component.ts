import { Component, OnDestroy, OnInit } from '@angular/core';
import { EpicService } from './service/epic.service';
import { catchError, Subject, takeUntil, tap, throwError } from 'rxjs';
import { Epic } from './interface/epic';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-epic',
  templateUrl: './epic.component.html',
  styleUrl: './epic.component.scss'
})
export class EpicComponent implements OnInit, OnDestroy {

  constructor(private epicService: EpicService) { }  

  epic$: Epic[] = []
  imageData$: any[] = []
  dateQuery!: string
  prevDate: string = ''

  ngOnInit(): void {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    this.prevDate = date.toISOString().split('T')[0]  
    
    this.getDataByDate()
  }

  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>();
  ngOnDestroy(): void {
    this.onDestroy.next()
    this.onDestroy.complete()
  }  

  getDataByDate() {
    this.epicService.getListByNaturalQuery(this.prevDate)
    .pipe(
      catchError(error => {
        return throwError(() => error)
      }),
      //?-- Al ser llamado el método onDestroy, automáticamente se desuscribe del Observable, para ahorrar memoria
      takeUntil(this.onDestroy),
      tap((res: Epic[]) => {
        this.epic$ = res        
        this.epic$.forEach(photo => {
          this.dateQuery = photo.date.substring(0, 10).split('-').join('/') //* YYYY/mm/dd
          //* Se inyecta la información de cada foto en un arreglo
          this.imageData$.push({ 
            src: `${environment.epicUrl}archive/natural/${this.dateQuery}/png/${photo.image}.png`,
            date: photo.date,
            lat: photo.coords.dscovr_j2000_position.y,
            lon: photo.coords.dscovr_j2000_position.x,
            caption: photo.caption
          })          
        });
      })
    )
    .subscribe()
  }
}
