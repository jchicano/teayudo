import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  public iconList: any[];

  constructor(
    private http: HttpClient
  ) {
    this.initializeIconList();
  }

  initializeIconList() {
    this.iconList = [
      {
        url: '/assets/img/card/autobus.png',
        desc: 'Autobús'
      },
      {
        url: '/assets/img/card/casa.png',
        desc: 'Casa'
      },
      {
        url: '/assets/img/card/cepillado_dientes.png',
        desc: 'Cepillado de dientes'
      },
      {
        url: '/assets/img/card/coche.png',
        desc: 'Coche'
      },
      {
        url: '/assets/img/card/comer_monigote.png',
        desc: 'Monigote comiendo'
      },
      {
        url: '/assets/img/card/comer_girl.png',
        desc: 'Niña comiendo'
      },
      {
        url: '/assets/img/card/comer_boy.png',
        desc: 'Niño comiendo'
      },
      {
        url: '/assets/img/card/pipi_girl.png',
        desc: 'Niña haciendo pipí'
      },
      {
        url: '/assets/img/card/pipi_boy.png',
        desc: 'Niño haciendo pipí'
      },
      {
        url: '/assets/img/card/caca_boy.png',
        desc: 'Niño haciendo caca'
      },
      {
        url: '/assets/img/card/excursion_campo.png',
        desc: 'Excursión al campo'
      },
      {
        url: '/assets/img/card/leche_galletas.png',
        desc: 'Leche con galletas'
      },
      {
        url: '/assets/img/card/parque.png',
        desc: 'Parque'
      },
      {
        url: '/assets/img/card/taza.png',
        desc: 'Taza'
      },
      {
        url: '/assets/img/card/vater.png',
        desc: 'Váter'
      },
      {
        url: '/assets/img/card/vestirse.png',
        desc: 'Vestirse'
      }
    ]
  }

  //=============================================================================
  // Funcion que devuelve una imagen convertida a base64 (NO USADA)
  //=============================================================================
  imageToBase64(imgURL: string) {
    // NOTE https://stackoverflow.com/a/56686980/10387022
    let converted: any = null;
    this.http.get(imgURL, { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          var base64data = reader.result;
          // console.log(base64data);
          converted = base64data;
        }

        reader.readAsDataURL(res);
        console.log(res);
      });
    return converted;
  }
}
