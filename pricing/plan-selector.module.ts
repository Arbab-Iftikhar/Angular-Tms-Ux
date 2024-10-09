import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PlanSelectorComponent } from './plan-selector/plan-selector.component';
import { PlanSelectorRoutingModule } from './plan-selector-routing.module';

@NgModule({
    declarations: [PlanSelectorComponent],
    imports: [
      PlanSelectorRoutingModule,
      SharedModule,
      TranslateModule
    ]
  })
  export class PlanSelectorModule { }