import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

@Injectable()
export class LockService {
  constructor (
    private http: Http
  ) {}

  poll(ip : string) {
    return this.http.get('http://' + ip + '/poll/')
      .retryWhen(error => error.delay(500))
      .timeout(3000);
  }
  unlock(ip : string, password : string) {
    let data = new URLSearchParams();
    data.append('password', password);
    return this.http.post('http://' + ip + '/', data)
      .timeout(3000);
  }
}
