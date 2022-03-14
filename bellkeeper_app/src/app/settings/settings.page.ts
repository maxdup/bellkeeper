import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { LockService } from '../lock.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  settings: any = {
    ip: '',
    password: '',
    duration: 0,
  };
  subscription: any = null;

  constructor(
    private router: Router,
    public lockService: LockService,
  ) {
    Object.assign(this.settings, this.lockService.settings);
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.subscription.unsubscribe();
        this.lockService.save(this.settings);
      }
    });
  }

  private routeChange
}
