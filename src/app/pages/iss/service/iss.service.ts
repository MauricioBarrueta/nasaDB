import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Iss } from '../interface/iss';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class IssService {

  constructor(private http: HttpClient) {}

  /* Se obtienen las coordenadas actuales de la Estación Espacial Internacional */
  getCurrentPosition(): Observable<Iss> {
    return this.http.get<Iss>(`${environment.ISSurl}`)
    .pipe(
      map((res: Iss) => { return res })
    )
  }
}
