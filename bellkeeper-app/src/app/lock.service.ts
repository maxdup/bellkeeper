import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
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
      .timeout(3000);
  }
  Unlock(ip : string, password : string) {
    let data = new URLSearchParams();
    data.append('password', password);
    return this.http.post('http://' + ip + '/', data)
      .timeout(3000);
  }
}
