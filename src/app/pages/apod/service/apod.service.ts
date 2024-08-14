import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APOD } from '../interface/apod';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class APODService {

  constructor(private http: HttpClient) { }

  /* Se obtiene la imagen astronómica del día (APOD por sus siglas en inglés) */
  getPictureOfTheDay(date: string): Observable<APOD> {
    return this.http.get<APOD>(`${environment.url}planetary/apod?date=${date}&api_key=${environment.key}`)
      .pipe(
        map((res: APOD) => { return res })
      )
  }
}