import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LockService {

  settings: any = {
    ip: '',
    password: '',
    duration: 3,
  }

  constructor() { this.load() }

  private load() : void {
    this.settings.ip = window.localStorage.getItem('ip');
    this.settings.password = window.localStorage.getItem('password');
    this.settings.duration = window.localStorage.getItem('duration');
  }
  public save(settings: any) : void {
    Object.assign(this.settings, settings);
    if (window.localStorage.getItem('ip') != this.settings.ip){
      window.localStorage.setItem('ip', this.settings.ip);
    }
    if (window.localStorage.getItem('password') != this.settings.password){
      window.localStorage.setItem('password', this.settings.password);
    }
    if (window.localStorage.getItem('duration') != this.settings.duration){
      window.localStorage.setItem('duration', this.settings.duration);
    }
  }

  public poll() : Promise<string> {
    console.log('( ͡° ͜ʖ ͡°)');
    return new Promise((resolve, reject) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      fetch('http://' + this.settings.ip + '/poll/',
            { signal: controller.signal })
        .then(() => {
          resolve('online');
        })
        .catch(() => {
          resolve('offline');
        });
    })
  }

  public unlock() : Promise<string> {
    console.log('ᕕ( ᐛ )ᕗ');

    return new Promise((resolve, reject) => {
      let data = new FormData();
      data.append('password', this.settings.password);
      data.append('duration', this.settings.duration);


      fetch('http://' + this.settings.ip + '/', {
        body: data,
        method: "POST"
      })
        .then ((response) => {
          switch(response.status){
            case 403:
              reject('denied');
              break;
            case 200:
              resolve('unlocked');
              break;
            default:
              resolve('error')
          }
        })
        .catch((err) => {
          reject('error')
        })
    })
  }
}
