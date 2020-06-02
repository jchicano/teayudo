import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  public messages: Array<string> = [];

  oldLog = console.log;
  oldWarn = console.warn;
  oldInfo = console.info;
  oldError = console.error;

  constructor() { }

  save(args, method) {
    // Extraigo el mensaje del log
    let data = Array.prototype.slice.apply(args).join(' ');
    if (typeof data === 'object') { // Si es un objeto lo formateo a JSON
      data = JSON.stringify(data, undefined, 4);
    }
    // Lo guardo en el array del servicio
    switch (method) {
      case 'log':
        this.messages.push('LOG' + ' at ' + new Date().toLocaleString() + ' => ' + data);
        break;
      case 'warn':
        this.messages.push('WARN' + ' at ' + new Date().toLocaleString() + ' => ' + data);
        break;
      case 'info':
        this.messages.push('INFO' + ' at ' + new Date().toLocaleString() + ' => ' + data);
        break;
      case 'error':
        this.messages.push('ERROR' + ' at ' + new Date().toLocaleString() + ' => ' + data);
        break;
      default:
        this.messages.push('UNDEFINED' + ' at ' + new Date().toLocaleString() + ' => ' + data);
        break;
    }
    // this.messages.push('LOG' + ' at ' + new Date().toLocaleString() + ' => ' + data);
  }

  saveLog(args) {
    // Extraigo el mensaje del log
    let data = Array.prototype.slice.apply(args).join(' ');
    if (typeof data === 'object') { // Si es un objeto lo formateo a JSON
      data = JSON.stringify(data, undefined, 4);
      this.messages.push('WARN' + ' at ' + new Date().toLocaleString() + ' => ' + data);
    } else {
      // Lo guardo en el array del servicio
      this.messages.push('LOG' + ' at ' + new Date().toLocaleString() + ' => ' + args);
    }
    // Muestro el mensaje en la consola
    this.oldLog.apply(console, arguments);
  }

  saveWarn(args) {
    let data = Array.prototype.slice.apply(args).join(' ');
    if (typeof data === 'object') { // Si es un objeto lo formateo a JSON
      data = JSON.stringify(data, undefined, 4);
      this.messages.push('WARN' + ' at ' + new Date().toLocaleString() + ' => ' + data);
    } else {
      this.messages.push('WARN' + ' at ' + new Date().toLocaleString() + ' => ' + args);
    }
    this.oldWarn.apply(console, arguments);
  }

  saveInfo(args) {
    let data = Array.prototype.slice.apply(args).join(' ');
    if (typeof data === 'object') { // Si es un objeto lo formateo a JSON
      data = JSON.stringify(data, undefined, 4);
      this.messages.push('WARN' + ' at ' + new Date().toLocaleString() + ' => ' + data);
    } else {
      this.messages.push('INFO' + ' at ' + new Date().toLocaleString() + ' => ' + args);
    }
    this.oldInfo.apply(console, arguments);
  }

  saveError(args, trace) {
    let data = Array.prototype.slice.apply(trace).join(' ');
    if (typeof data === 'object') { // Si es un objeto lo formateo a JSON
      data = JSON.stringify(data, undefined, 4);
      this.messages.push('WARN' + ' at ' + new Date().toLocaleString() + ' => ' + data + ': ' + trace);
    } else {
      this.messages.push('ERROR' + ' at ' + new Date().toLocaleString() + ' => ' + args + ': ' + trace);
    }
    this.oldError.apply(console, arguments);
  }

  saveAsFile() {
    // Only on browser
    const blob = new Blob(this.messages, { type: 'text/json' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
    a.download = 'console.json';
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);

    // alert(this.messages);
  }
}
