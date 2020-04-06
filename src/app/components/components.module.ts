import { BouncingArrowComponent } from './bouncing-arrow/bouncing-arrow.component';
import { IonicModule } from '@ionic/angular';
import { SpinnerComponent } from './spinner/spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmCheckboxComponent } from './confirm-checkbox/confirm-checkbox.component';

// NOTE https://youtu.be/za5NaFavux4

@NgModule({
  declarations: [ConfirmCheckboxComponent, SpinnerComponent, BouncingArrowComponent],
  imports: [
    CommonModule,
    IonicModule // NOTE https://stackoverflow.com/a/54387068/10387022
  ],
  exports: [ConfirmCheckboxComponent, SpinnerComponent, BouncingArrowComponent]
})
export class ComponentsModule { }
