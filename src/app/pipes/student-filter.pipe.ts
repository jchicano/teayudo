import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studentFilter'
})
export class StudentFilterPipe implements PipeTransform {

  transform(array: any[], text: string, field: string): any[] {

    if(text === '') {
      return array;
    }

    text = text.toLowerCase();

    return array.filter(item => {
      return item[field].toLowerCase().includes(text);
    });
  }

}
