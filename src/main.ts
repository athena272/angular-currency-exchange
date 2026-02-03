import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ConfigService } from './app/core/services/config.service';
import { APP_INITIALIZER } from '@angular/core';

function loadConfig(config: ConfigService) {
  return () => config.loadConfig();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [ConfigService],
      multi: true
    }
  ]
}).catch(err => console.error(err));
