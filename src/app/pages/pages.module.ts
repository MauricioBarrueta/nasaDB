import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { APODComponent } from './apod/apod.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { MarsComponent } from './mars/mars.component';
import { HeaderComponent } from '../header/header.component';
import { MarsPhotosComponent } from './mars/mars-photos/mars-photos.component';
import { SafePipe } from '../safe.pipe';
import { EpicComponent } from './epic/epic.component';
import { ISSComponent } from './iss/iss.component';

@NgModule({
  declarations: [
    APODComponent,
    EpicComponent,
    MarsComponent,
    MarsPhotosComponent,
    ISSComponent,
    HeaderComponent,  
    SafePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    RouterModule
  ],
  exports: [
    RouterModule,
    FormsModule,
    APODComponent,
    MarsComponent,
    MarsPhotosComponent,
    HeaderComponent,
    EpicComponent,
    ISSComponent
  ],
  providers: [
    provideHttpClient(),
    DatePipe
  ]
})
export class PagesModule { }
