import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './presentation/app/app.config';
import { App } from './presentation/app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
