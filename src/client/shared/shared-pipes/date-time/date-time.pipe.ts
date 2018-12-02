import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {
  datePipe: DatePipe = new DatePipe('en-US');
  constructor() {

  }

  transform(value: Date): any {
    return this.datePipe.transform(value, 'dd.MM.yyyy HH:mm');
  }

}
