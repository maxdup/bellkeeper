import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, Keyboard } from 'ionic-angular';
import { LockService } from '../../app/lock.service'

@Component({
  selector: 'page-mainpage',
  templateUrl: 'mainpage.html',
  providers: [LockService]
})
export class MainPage {
  @ViewChild(Slides) slides: Slides;
  status: string;

  password: string;
  ip: string;
  duration: number;

  constructor(public navCtrl: NavController, private lockService: LockService,
    public keyboard: Keyboard) {
      let storage = window.localStorage;
      this.ip = storage.getItem('ip')
      this.password = storage.getItem('password')
      this.duration = +storage.getItem('duration')
      this.query();
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
    this.status = "polling";
    this.lockService.poll(this.ip).subscribe(
      data => this.updateStatus(data.status),
      error => this.updateStatus(error.status)
    );
  }

  updateStatus(status : number)
  {
    console.log("status", status);

    if (status == undefined || status == 0) {
      this.status = "offline";
    }
    else {
        this.status = "online";
    }
  }

  saveSettings(){
    let storage = window.localStorage;
    storage.setItem('ip', this.ip);
    storage.setItem('password', this.password);
    storage.setItem('duration', ""+this.duration);
  }

}