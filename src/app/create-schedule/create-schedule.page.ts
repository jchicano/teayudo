import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.page.html',
  styleUrls: ['./create-schedule.page.scss'],
})
export class CreateSchedulePage implements OnInit {

  public itemQuantity: number[];

  constructor(
  ) {
    this.itemQuantity = [];
  }

  ngOnInit() {
  }

  addCard(): void {
    console.log('Click FAB')
    this.itemQuantity.push(1);
    console.log(this.itemQuantity.length);
  }
/*
  // Funcion auxiliar para devolver la cantidad de elementos
  createRange(number): number[] {
    // NOTE https://stackoverflow.com/a/36095565/10387022
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
*/
}
