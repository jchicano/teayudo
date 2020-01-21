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
        value: 'azul',
        hex: '#8ed1f7'
      },
      {
        name: 'Verde',
        value: 'verde',
        hex: '#a3dc93'
      },
      {
        name: 'Vino',
        value: 'vino',
        hex: '#c05c92'
      },
      {
        name: 'Amarillo',
        value: 'amarillo',
        hex: '#fdf962'
      },
      {
        name: 'Bosque acuático',
        value: 'bosqueacuatico',
        hex: '#56ae72'
      },
      {
        name: 'Oro viejo',
        value: 'oroviejo',
        hex: '#d39e3a'
      },
      {
        name: 'Granada',
        value: 'granada',
        hex: '#f44336'
      },
      {
        name: 'Gris',
        value: 'gris',
        hex: '#d6d6d6'
      },
      {
        name: 'Rosa',
        value: 'rosa',
        hex: '#ffbaf7'
      },
      {
        name: 'Naranja',
        value: 'naranja',
        hex: '#ff7c6b'
      }
    ];
  }
  
}