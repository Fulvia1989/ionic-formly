import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideFormlyCore } from '@ngx-formly/core'
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { SympleInputType } from './app/custom-types/input.type';
import { SimpleSelectType } from './app/custom-types/simple-select.type';
import { StepperType } from './app/custom-types/stepper.type';
import { ObjectSelectType } from './app/custom-types/object-select.type';
import { SimpleCheckboxType } from './app/custom-types/checkbox.type';
import { State } from './app/components/wizard/shared';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFormlyCore({
      types:[
        {name: 'input',component: SympleInputType},
        {name:'simple-select',component:SimpleSelectType},
        {name: 'stepper', component:StepperType},
        {name:'object-select',component:ObjectSelectType},
        {name:'checkbox',component:SimpleCheckboxType},


      ]
    }),
    State
  ],
});
