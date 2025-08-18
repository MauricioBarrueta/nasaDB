import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Epic } from '../interface/epic';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EpicService {

  constructor(private http: HttpClient) { }

  /* Para obtener las imágenes capturadas en el día más reciente disponible */
  getLastImages() {
    return this.http.get<Epic[]>(`${environment.epicUrl}`)
      .pipe(
        map((res: Epic[]) => {
          return res
        })
      )
  }

  /* Para obtener las imágenes capturadas el día anterior a la fecha actual */
  getImagesByDate(date: string): Observable<Epic[]> {
    return this.http.get<Epic[]>(`${environment.epicUrl}/date/${date}`)
      .pipe(
        map((res: Epic[]) => {
          return res
        })
      )
  } 
}