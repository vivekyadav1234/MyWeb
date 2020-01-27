import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as jQuery from "jquery";
(window as any).$ = (window as any).jQuery = jQuery;

// import * as jQuery from "jquery";
// (window as any).$ = (window as any).jQuery = jQuery;
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

