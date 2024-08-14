import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    FormsModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    DatePipe //* Para obtener la fecha [yyyy-MM-dd] actual con Date Pipe 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
