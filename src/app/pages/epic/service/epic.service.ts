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

  /* Obtiene la lista de imágenes del EPIC */
  getListByNaturalQuery(date: string): Observable<Epic[]> {
    return this.http.get<Epic[]>(`${environment.url}EPIC/api/natural/date/${date}?api_key=${environment.key}`)
      .pipe(
        map((res: Epic[]) => {
          return res
        })
      )
  } 
}