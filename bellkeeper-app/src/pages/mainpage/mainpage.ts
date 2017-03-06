import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, Keyboard } from 'ionic-angular';
import { LockService } from '../../app/lock.service'
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'page-mainpage',
  templateUrl: 'mainpage.html',
  providers: [LockService]
})
export class MainPage {
  @ViewChild(Slides) slides: Slides;
  status: string;
  lock: string;

  password: string;
  ip: string;
  duration: number;

  constructor(public navCtrl: NavController,
    private lockService: LockService, public keyboard: Keyboard) {
      let storage = window.localStorage;
      this.ip = storage.getItem('ip')
      this.password = storage.getItem('password')
      this.duration = +storage.getItem('duration')
      this.lock = "";
      this.status = "polling";
      this.query();
      console.log(this);
  }
  goToSlide(id : number){
    this.slides.slideTo(id);
    if (id == 0){
      this.saveSettings();
    }
  }
  releaseFocus(){
    this.keyboard.close();
  }

  query(){
    if (this.status != "online" && this.status != "denied"){
      this.status = "polling";
      this.lockService.poll(this.ip).subscribe(
        data => this.updateStatus(data.status),
        error => this.updateStatus(error.status)
      );
    }
    else {
      if (this.lock == "") {
        console.log("queried");
        this.lockService.unlock(this.ip, this.password).subscribe(
          data => this.unlockHandler(data.status),
          error => this.unlockHandler(error.status)
        )
      }
    }
  }

  updateStatus(status : number) {
    console.log("status", status);

    if ( status == 204){
      this.status = "online";
    }
    else {
      this.status = "offline";
    }
  }

  unlockHandler(status: number){
    switch (status) {
      case 403:
      this.status = "denied";
      this.lock = "locked";
      this.timedRelock(3);
      break;

      case 200:
      this.status = "online";
      this.lock = "unlocked";
      this.timedRelock(this.duration);
      break

      default:
      this.status = "offline";
      this.lock = "locked";
      this.timedRelock(3);
    }
  }

  timedRelock(duration: number){
    let timer = Observable.timer(duration*1000);
    timer.subscribe(t => this.relock());
  }

  relock(){
    this.lock = "";
  }

  saveSettings(){
    let storage = window.localStorage;
    storage.setItem('ip', this.ip);
    storage.setItem('password', this.password);
    storage.setItem('duration', ""+this.duration);
  }
}