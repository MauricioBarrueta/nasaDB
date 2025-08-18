import { HttpClient } from '@angular/common/http';
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
    return this.http.get<PhotoManifestResponse>(`${environment.url}mars-photos/api/v1/manifests/${rover}?api_key=${environment.key}`)
      .pipe(
        map((res: PhotoManifestResponse) => {
          return res.photo_manifest
        })
      )
  }

  /* Obtiene la lista de fotografías de acuerdo al día terrestre y la cámara seleccionada */
  getPhotosByEarthDate(rover: string, date: string, camera: string): Observable<MarsPhotos[]> {
    return this.http.get<MarsResponse>(`${environment.url}mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&camera=${camera}&api_key=${environment.key}`)
    .pipe(
      map((res: MarsResponse) => {
        return res.photos
      })
    )
  }

  /* Obtiene la lista de fotografías de acuerdo al día marciano y a la cámara seleccionada */
  getPhotosBySolDate(rover: string, sol: number, camera: string): Observable<MarsPhotos[]> {
    return this.http.get<MarsResponse>(`${environment.url}mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&camera=${camera}&api_key=${environment.key}`)
    .pipe(
        map((res: MarsResponse) => {
          return res.photos
        })
      )
  }
}