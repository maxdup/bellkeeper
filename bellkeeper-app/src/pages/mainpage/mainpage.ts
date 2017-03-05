import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-mainpage',
  templateUrl: 'mainpage.html'
})
export class MainPage {
  @ViewChild(Slides)
  slides: Slides;
  
  constructor(public navCtrl: NavController) {
  }
  goToSlide(id : number){
    this.slides.slideTo(id);
  }

}
