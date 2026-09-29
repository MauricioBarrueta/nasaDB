import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safe',
    standalone: false
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}
  
  transform(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);  
  }

  /**
   * * Se creó un Pipe para permitir el error de URL inseguro al pasar el url de un video de YouTube al iframe del módulo APOD o el url de Google Maps en el módulo ISS
   * ! Comandos: ng g pipe safe
   * * Y se declaró en pages.module.ts
   * * Para ver como funciona ir a apod.component.html O iss.component.html 
  */
}
