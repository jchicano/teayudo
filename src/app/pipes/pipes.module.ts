import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFilterPipe } from './student-filter.pipe';

// NOTE https://youtu.be/ugZDc_bL8PY

@NgModule({
  declarations: [StudentFilterPipe],
  imports: [
    CommonModule
  ],
  exports: [
    StudentFilterPipe
  ]
})
export class PipesModule { }
