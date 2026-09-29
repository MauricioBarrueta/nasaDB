import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mars',
    templateUrl: './mars.component.html',
    styleUrl: './mars.component.scss',
    standalone: false
})
export class MarsComponent {  

  constructor(private router: Router) {}

  /* Obtiene el valor del elemento seleccionado y lo manda como parámetro */
  getSelectedRover(param: string) {
    this.router.navigate([`mars-exploration/photos/mission`], { queryParams: { rover: `${param}` } })
  }

}
