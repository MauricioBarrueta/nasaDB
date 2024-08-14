import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APODComponent } from './pages/apod/apod.component';
import { MarsComponent } from './pages/mars/mars.component';
import { MarsPhotosComponent } from './pages/mars/mars-photos/mars-photos.component';
import { EpicComponent } from './pages/epic/epic.component';
import { ISSComponent } from './pages/iss/iss.component';

const routes: Routes = [
  { path: '', redirectTo: 'astronomy/picture-of-the-day', pathMatch: 'full' },

  { path: 'astronomy/picture-of-the-day', component: APODComponent},
  { path: 'dscovr-satellite/epic-camera', component: EpicComponent },
  { path: 'mars-exploration/photos', component: MarsComponent }, 
  { path: 'mars-exploration/photos/mission', component: MarsPhotosComponent },
  { path: 'tracking/international-space-station', component: ISSComponent }, 

  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
