import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// NOTE https://stackblitz.com/edit/rxjs-confetti?file=src%2Findex.html
// Libreria https://github.com/catdad/canvas-confetti
// Este no me ha funcionado https://itnext.io/a-ux-micro-interaction-to-celebrate-canvas-confetti-for-angular-18bdadffeec7

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CelebrateModule {

  // Da igual lo que pongamos, se muestra el confetti por defecto
  private defaultOpts = { angle: 45, particleCount: 360, origin: { y: 0.6 } };

  showOnce() {
    return window['confetti'].apply(this.defaultOpts);
  }

  showByShots(shotsQuantity) {
    var counter = 0;
    var interval = setInterval(function () {
      counter++;

      if (counter > shotsQuantity) {
        return clearInterval(interval);
      }
      return window['confetti'].apply(this.defaultOpts);
    }, 1000);
  }

  showByTime(seconds, frequency) {
    var duration = seconds * 1000;
    var animationEnd = Date.now() + duration;
    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      return window['confetti'].apply(this.defaultOpts);
    }, frequency);
  }

}
