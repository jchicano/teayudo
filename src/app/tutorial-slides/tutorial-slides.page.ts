import { Platform, IonSlides } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tutorial-slides',
  templateUrl: './tutorial-slides.page.html',
  styleUrls: ['./tutorial-slides.page.scss'],
})
export class TutorialSlidesPage implements OnInit {

  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  slides = [
    {
      img: 'assets/img/slides/add.svg',
      title: 'Crea un alumno'
    },
    {
      img: 'assets/img/slides/prepare.svg',
      title: 'Asígnale un horario'
    },
    {
      img: 'assets/img/slides/play.svg',
      title: 'Reprodúcelo'
    },
    {
      img: 'assets/img/slides/next.svg',
      title: '¿Listo para empezar?'
    }
  ];

  @ViewChild('slidesElement', { static: false }) ionSlides: IonSlides;
  public disablePrevBtn = true;
  public disableNextBtn = false;

  constructor(
    public platform: Platform
  ) { }

  ngOnInit() { }

  // NOTE https://stackoverflow.com/a/55480623/10387022
  doCheck() {
    let prom1 = this.ionSlides.isBeginning();
    let prom2 = this.ionSlides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

  nextSlide() {
    this.ionSlides.slideNext();
  }

  previousSlide() {
    this.ionSlides.slidePrev();
  }

}


