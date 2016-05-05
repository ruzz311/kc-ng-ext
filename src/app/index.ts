// App
export * from './app.component';
export * from './app.service';

import {provide} from '@angular/core';
import {AppState} from './app.service';
import {ROUTER_PROVIDERS} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

// Application wide providers
export const APP_PROVIDERS = [
  AppState,
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy})
];
