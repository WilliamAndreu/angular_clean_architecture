import { reportBootstrapError } from 'src/core/utils/error/report-bootstrap-error.util';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './presentation/app/app.config';
import { App } from './presentation/app/app';

bootstrapApplication(App, appConfig).catch((error: unknown) => reportBootstrapError(error));
