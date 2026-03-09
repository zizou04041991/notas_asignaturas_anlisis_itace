import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // 1. Animations
import { provideToastr } from 'ngx-toastr'; // 2. Toastr

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
export const appConfig: ApplicationConfig = {
  providers: [
     //provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }), // Toastr configuration
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    importProvidersFrom(FontAwesomeModule),
  ],
};
