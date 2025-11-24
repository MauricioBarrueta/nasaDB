import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PhotoManifest, PhotoManifestResponse } from '../mars-photos/interface/photo-manifest';
import { MarsPhotos, MarsResponse } from '../interface/mars-photos';

@Injectable({
  providedIn: 'root'
})
export class MarsService {

  constructor(private http: HttpClient) { }

  /* Obtiene el Manifest (datos) dependiendo el Rover que se seleccionó */
  getRoverManifest(rover: string): Observable<PhotoManifest> {
    return this.http.get<PhotoManifestResponse>(`${environment.marsUrl}/manifests/${rover}`)
      .pipe(
        map((res: PhotoManifestResponse) => {
          return res.photo_manifest
        })
      )
  }

  /* Obtiene la lista de imágenes de acuerdo al día solar/fecha terrestre y a la cámara seleccionada */
  getPhotos( rover: string, camera: string, options: { earth_date?: string; sol?: number }): Observable<MarsPhotos[]> {
    /* Parámetros creados dinámicamente */
    let params = new HttpParams().set('camera', camera)
    if (options.earth_date) {
      params = params.set('earth_date', options.earth_date)
    }
    if (options.sol !== undefined) {
      params = params.set('sol', options.sol.toString())
    }
    return this.http.get<MarsResponse>(`${environment.marsUrl}/rovers/${rover}/photos`, { params })
      .pipe(
        map(res => res.photos)
      );
  }
}