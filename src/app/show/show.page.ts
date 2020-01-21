import { Platform } from '@ionic/angular';
import { element } from 'protractor';
import { card } from './../model/card';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowPage implements OnInit {

  public cardList: card[];
  public slideOpts: any;
  @ViewChild('scroll', { static: false }) scroll: ElementRef;
  @ViewChild('progressBar', { static: false }) progressBar: ElementRef;

  public cardsTime: number[];
  public cardsTimeNew: number[]; // TODO error lo he creado porque como le resto 1000 a cardsTime no podia ser asi
  public totalTime: number;
  public progressBarMargin: number;
  public progressBarMaxWidth: number;
  public deviceInitialWidth: number;
  public scrollCurrentValue: number;//
  public scrollMaxValue: number;//
  public executeFirstTimeOnly: boolean;
  public scheduleRunning: boolean
  public currentIndex: number;
  public displayTime: string[];
  public autoScroll: boolean;
  public scrollAutomaticValue: number; // Almaceno el scroll que tendra la barra

  constructor(
    private router: Router,
    private platform: Platform
  ) {
    this.cardList = [];
    this.cardsTime = [];
    this.cardsTimeNew = [];
    this.totalTime = 0;
    this.progressBarMargin = 0;
    this.progressBarMaxWidth = 0;
    this.scrollCurrentValue = 0;
    this.scrollMaxValue = 0;
    this.executeFirstTimeOnly = true;
    this.scheduleRunning = false;
    this.currentIndex = 0;
    this.displayTime = []; // Array que almacena cada segundo los millis restantes de la tarjeta indice. Creado para no llamar varias veces por segundo a millisToTime() desde la vista
    this.deviceInitialWidth = 0; // Anchura de la pantalla cuando se carga la pagina
    this.autoScroll = true;
    this.scrollAutomaticValue = 0;
  }

  ngOnInit() {
    console.log('Tarjetas recibidas');
    this.cardList = this.router.getCurrentNavigation().extras.state.cards;
    this.cardList.forEach((card, index) => {
      console.log('Card ' + index + ':');
      // console.log('Duration RAW: ' + card.duration);
      let onlyTime = card.duration.split('T').pop().split('+')[0]; // Separo las horas hh:mm
      // console.log('Duration time: ' + onlyTime);
      var timeMillis = Number(onlyTime.split(':')[0]) * 60 + Number(onlyTime.split(':')[1]) * 60 * 1000; // Convierto las horas a milisegundos
      console.log('Duration millis: ' + timeMillis);
      this.cardsTime.push(timeMillis);
      this.cardsTimeNew.push(timeMillis);
      this.displayTime.push(this.millisToTime(timeMillis));
      this.totalTime += timeMillis;
    });
    console.log('Total time: ' + this.totalTime + 'ms');
  }

  ionViewWillEnter() {
    if (this.executeFirstTimeOnly) {
      this.progressBarMaxWidth = this.progressBar.nativeElement.offsetWidth; // Tamano maximo de la barra de progreso
      this.progressBarMargin = this.progressBarMaxWidth; // Oculto la barra de progreso poniendo el maximo en negativo (en la vista)
      this.deviceInitialWidth = this.platform.width(); // Anchura del dispositivo
      this.scrollCurrentValue = 0; // Valor actual de la barra de scroll
      this.scrollMaxValue = this.scroll.nativeElement.scrollWidth - this.scroll.nativeElement.clientWidth; // Valor maximo de la barra de scroll
      this.scroll.nativeElement.scrollLeft = 0; // Establezco el comienzo a 0
      this.executeFirstTimeOnly = false; // Bajo la bandera
    }
  }

  scrollInfo() {
    // let element = document.querySelector('.scroll');
    console.log(this.scroll.nativeElement);
    console.log('scrollLeft: ' + this.scroll.nativeElement.scrollLeft); // Cantidad de scroll
    // this.scroll.nativeElement.scrollLeft = 571; // Establecemos nueva posicion para el scroll
    console.log('scrollLeft: ' + this.scroll.nativeElement.scrollLeft);
    console.log('scroll total: ' + (this.scroll.nativeElement.scrollWidth - this.scroll.nativeElement.clientWidth)); // Cantidad maxima para scrollLeft
  }

  updateProgressBar() {
    console.log('Running Progress Bar...');
    let counter = 0;
    this.currentIndex = 0;
    let interval = setInterval(() => {

      let ratio = undefined;
      this.cardList.forEach((card, index) => {
        if (!card.completed) {
          if (this.platform.width() !== this.deviceInitialWidth) { // Ha variado el ancho del dispositivo
            console.log('RECARGAR BARRA Y SCROLL');
            this.deviceInitialWidth = this.platform.width();

            // Explicacion de la formula mas abajo, basicamente actualizo el margen cuando se detectan cambios en el ancho de la pantalla del dispositivo
            this.progressBarMargin = this.progressBar.nativeElement.offsetWidth - (this.progressBar.nativeElement.offsetWidth * (this.progressBarMaxWidth - this.progressBarMargin)) / this.progressBarMaxWidth;
            this.progressBarMaxWidth = this.progressBar.nativeElement.offsetWidth;// Actualizo el valor maximo de la barra de progreso
            // PALO EN EL LOMO
            this.scrollCurrentValue = this.scrollMaxValue
            this.scroll.nativeElement.scrollLeft
          }
          ratio = this.progressBarMaxWidth / this.cardList.length / this.cardsTime[index];
          ratio *= 1000; // Lo multiplico para obtener los millis

          console.log('Ratio: ' + ratio);

          /*
          Explicacion regla de 3:
            margen/progreso                                                               widthBarra
            200 (cuando progressBarMargin = -50 equivale a que he pintado 200px)          250
            x                                                                             300 (por poner un valor, sera el nuevo ancho de la barra al aumentar el ancho la pantalla [tambien sirve si se disminuye])
            __________
            300*200/250=240
            300-240=60px es la nueva medida del margen de la barra
          */
        }
      });
      if (this.progressBarMargin >= 0) { // Todavia no se ha llegado al maximo del progreso
        // Actualizo barra
        this.progressBarMargin -= ratio;
        // Actualizo scroll
        this.scrollAutomaticValue = this.scrollMaxValue * ((this.progressBarMaxWidth - this.progressBarMargin) / this.progressBarMaxWidth); // Regla de 3 para hallar el porcentaje del progreso
        if (this.autoScroll) {
          this.scroll.nativeElement.scrollLeft = this.scrollAutomaticValue;
        }
      }
      else { // Se ha llegado al maximo del progreso
        this.progressBarMargin = 0; // Lo pongo a 0 para que se vea perfectamente completa la barra
        clearInterval(interval); // Paro el intervalo
        this.scheduleRunning = false;
        console.log('Fin del horario');
      }
      if (this.cardList[this.currentIndex].completed !== true) {
        this.cardsTimeNew[this.currentIndex] -= 1000;
        this.displayTime[this.currentIndex] = this.millisToTime(this.cardsTimeNew[this.currentIndex]);
        // console.log('comprobando si '+counter+'>='+this.cardsTime[indexTmp]);
        if (counter >= this.cardsTime[this.currentIndex]) { // Se ha pasado el tiempo de la tarjeta actual
          console.log('Tarjeta ' + this.currentIndex + ' compeltada. Estableciendo card.completed a true');
          console.log(this.cardList);
          // console.log(this.cardList[this.currentIndex]);
          this.cardList[this.currentIndex].completed = true;
          this.currentIndex++;
          counter = 0;
          // if (this.cardsTimeNew[this.currentIndex] <= 0) { // Si nos pasamos de tiempo
          //   this.cardsTimeNew[this.currentIndex] = 0;
          //   console.log('tarjeta indice ' + this.currentIndex + ' terminado');
          // }
        }
      }
      counter += 1000;
    }, 1000);
  }

  toggleAutoScroll() {
    this.autoScroll = !this.autoScroll;
  }

  comenzarHorario() {
    console.log('Comenzando horario...');
    this.scheduleRunning = true;
    this.updateProgressBar();
  }

  millisToTime(ms: number): string {
    // NOTE https://stackoverflow.com/a/58531661/10387022
    // console.log('Convirtiendo ' + ms + 'ms a tiempo');
    if (ms > 0) return new Date(ms).toISOString().slice(11, 19);
    return '00:00:00';
  }

  timerForCard(index: number) {
    console.log('Creando intervalo para tarjeta indice ' + index);
    let interval = setInterval(() => {
      this.cardsTimeNew[index] -= 1000;
      if (this.cardsTimeNew[index] <= 0) {
        clearInterval(interval);
        this.cardsTimeNew[index] = 0;
        console.log('Intervalo de tarjeta indice ' + index + ' terminado');
      }
    }, 1000);
  }


  // TODO quitar variables repetidas y/o inutiles
}