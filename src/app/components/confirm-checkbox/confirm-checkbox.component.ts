import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-checkbox',
  templateUrl: './confirm-checkbox.component.html',
  styleUrls: ['./confirm-checkbox.component.scss'],
})
export class ConfirmCheckboxComponent implements OnInit {

  @Input()
  public customId: number;
  @Input()
  public isChecked: boolean;

  constructor() {
    this.isChecked = false;
  }

  ngOnInit() {
    console.log("Component id: " + this.customId);
    console.log("Component checked: " + this.customId);
  }

}
