import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeLeft',
})
export class TimeLeftPipe implements PipeTransform {
  transform(s: number): string {
    let sec_num = s;
    s = Math.abs(s);
    let hours: number | string = Math.floor(s / 3600);
    let minutes: number | string = Math.floor((s - hours * 3600) / 60);
    let seconds: number | string = s - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return (sec_num < 0 ? '-' : '') + hours + ' : ' + minutes + ' : ' + seconds;
  }
}
