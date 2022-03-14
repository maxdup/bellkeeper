import { Component } from '@angular/core';
import { NavController } from "@ionic/angular";
import { Router, NavigationEnd } from '@angular/router';

import { LockService } from '../lock.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  status: string = '';
  locked: string = '';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public lockService: LockService,
  ) {
    this.router.events.subscribe((event) => {
      this.locked = '';
      this.status = '';
      if (event instanceof NavigationEnd && event.url == '/main') {
        this.poll();
      }
    })
  }

  public openSettings(): void {
    this.navCtrl.navigateForward(["main-settings"]);
  }

  public query(): void {
    if (this.status != 'online' && this.status != 'denied'){
	  this.poll();
    } else {
	  if (this.locked == ""){
        this.attempt();
	  }
    }
  }

  private poll(): void {
    this.status = 'polling';
    this.lockService.poll().then((result) => {
      this.status = result;
    });
  }

  private attempt(): void {
    this.lockService.unlock().then(()=> {
      this.status = 'online';
      this.locked = 'unlocked';
      setTimeout(this.relock.bind(this), this.lockService.settings.duration * 1000);
    }, (err) => {
      this.status = err == 'denied' ? 'denied' : 'offline';
      this.locked = 'locked';
      setTimeout(this.relock, 3 * 1000);
    })
  }

  private relock(){
    this.locked = "";
  }
}
