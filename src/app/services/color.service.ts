import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  public colorList: any[];

  constructor() {
    this.initializeColorList();
}

  private initializeColorList() {
    this.colorList = [
      {
        name: 'Azul',
        value: 'azul'
      },
      {
        name: 'Verde',
        value: 'verde'
      },
      {
        name: 'Vino',
        value: 'vino'
      },
      {
        name: 'Amarillo',
        value: 'amarillo'
      },
      {
        name: 'Bosque acuático',
        value: 'bosqueacuatico'
      },
      {
        name: 'Oro viejo',
        value: 'oroviejo'
      },
      {
        name: 'Granada',
        value: 'granada'
      },
      {
        name: 'Gris',
        value: 'gris'
      },
      {
        name: 'Rosa',
        value: 'rosa'
      },
      {
        name: 'Naranja',
        value: 'naranja'
      }
    ];
  }

}