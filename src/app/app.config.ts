import { ApplicationConfig, SecurityContext } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { provideHighlightOptions } from 'ngx-highlightjs';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideMarkdown({
      sanitize: SecurityContext.NONE
    }),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
      themePath: 'assets/styles/solarized-dark.css'
    })
  ],
};
