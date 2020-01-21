import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FontService {

  private currentFont: string;
  private availableFonts: any[];

  constructor() {
    this.currentFont = '';
    this.initializeAvailableFonts();
  }

  private initializeAvailableFonts() {
    this.availableFonts = [
      {
        name: 'Default',
        value: ''
      },
      {
        name: 'Escolar',
        value: 'escolar-font' // nombre de la clase en fonts.scss
      }
    ];
  }

  setCurrentFont(fontName: string) {
    this.currentFont = fontName;
  }

  getCurrentFont() {
    return this.currentFont;
  }

  getAvailableFonts() {
    return this.availableFonts;
  }
}
