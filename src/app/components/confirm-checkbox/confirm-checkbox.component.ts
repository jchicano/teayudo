import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-checkbox',
  templateUrl: './confirm-checkbox.component.html',
  styleUrls: ['./confirm-checkbox.component.scss'],
})
export class ConfirmCheckboxComponent implements OnInit {

  @Input() public customId: number;
  @Input() public isChecked: boolean;
  @Output() public typeChanged = new EventEmitter<string>();

  // Funcion que manda el valor del checkbox
  emitValue() {
    // NOTE https://stackoverflow.com/a/50837509/10387022
    this.isChecked=!this.isChecked;
    this.typeChanged.emit(this.isChecked+'-'+this.customId);
  }


  constructor() {
    this.isChecked = false;
  }

  ngOnInit() {
    console.log('Component id: ' + this.customId + '. Component checked: ' + this.isChecked);
  }

}
