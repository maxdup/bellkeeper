import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { LockService } from '../../app/lock.service'

@Component({
  selector: 'page-mainpage',
  templateUrl: 'mainpage.html',
  providers: [LockService]
})
export class MainPage {
  @ViewChild(Slides)
  slides: Slides;
  status: string;

  password: string;
  ip: string;

  constructor(public navCtrl: NavController, private lockService: LockService) {
    this.query();
  }
  goToSlide(id : number){
    this.slides.slideTo(id);
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
}