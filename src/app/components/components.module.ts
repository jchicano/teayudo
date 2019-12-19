import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmCheckboxComponent } from './confirm-checkbox/confirm-checkbox.component';

// NOTE https://youtu.be/za5NaFavux4

@NgModule({
  declarations: [ConfirmCheckboxComponent],
  imports: [
    CommonModule,
  ],
  exports: [ConfirmCheckboxComponent]
})
export class ComponentsModule { }
