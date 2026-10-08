import { Component, OnDestroy, OnInit } from '@angular/core';
import { APODService } from './service/apod.service';
import { catchError, Subject, takeUntil, tap, throwError } from 'rxjs';
import { APOD } from './interface/apod';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-apod',
    templateUrl: './apod.component.html',
    styleUrl: './apod.component.scss',
    standalone: false
})

export class APODComponent implements OnInit, OnDestroy {

  constructor(private apodService: APODService, private datePipe: DatePipe) { }

  apod$!: APOD
  date!: any
  mediaVideoUrl!: string

  title: string = ''

  //? -- Los Subject sirven de 'puente' entre los Observables y las Subscripciones
  private readonly onDestroy = new Subject<void>();
  
  ngOnInit(): void {     
    //* Se obtiene la fecha actual con el formato especificado
    this.date = this.datePipe.transform(new Date(), 'yyMMdd');
    this.getPictureOfTheDay()       
  }

  ngOnDestroy(): void {
    this.onDestroy.next()
    this.onDestroy.complete()
  }

  /* Se obtiene la imagen astronómica del día */
  getPictureOfTheDay() {
    this.apodService.getPictureOfTheDay(this.date)
    .pipe(
      catchError(error => {        
        return throwError(() => error)
      }),
      //? -- Al ser llamado el método onDestroy, automáticamente se desuscribe del Observable, para ahorrar memoria
      takeUntil(this.onDestroy),
      tap((res: APOD) => {
        this.apod$ = res            

        this.apod$.explanation = this.setLinksToNewTab(this.apod$.explanation)
        if (this.apod$.copyright) {
          this.apod$.copyright = this.setLinksToNewTab(this.apod$.copyright)
        }

        if (this.apod$.media_type === 'video') {
          this.mediaVideoUrl = this.getVideoUrl(this.apod$.basic_html)
        }
        
        switch (this.apod$.media_type) {
          case 'image':
            this.title = 'Esta es la imagen astronómica del día'
            break

          case 'video':
            this.title = 'Este es el video astronómico del día'
            break
            
          default:
            this.title = 'Este es el contenido astronómico del día'
        }
      })
    )
    .subscribe()    
  }

  /* Se agregan atributos para abrir los enlaces en una nueva pestaña */
  private setLinksToNewTab(html: string): string {
    return html.replace(/<a\b/gi, '<a target="_blank" rel="noopener noreferrer"')
  }

  /* Obtiene la URL del video desde el iframe incluido en basic_html */
  private getVideoUrl(html: string): string {
    const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/i) /* Busca la etiqueta iframe y captura el contenido de su atributo src */

    return match ? `https:${match[1]}` : ''
  }
}
