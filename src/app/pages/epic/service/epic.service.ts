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
  getListByNaturalQuery(): Observable<Epic[]> {
    return this.http.get<Epic[]>(`${environment.epicUrl}api/natural`)
      .pipe(
        map((res: Epic[]) => {
          return res
        })
      )
  } 
}