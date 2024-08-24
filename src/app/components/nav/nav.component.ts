import { Component } from '@angular/core';
import { NgbNavConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NewExpensesComponent } from '../new-expenses/new-expenses.component';
import { AllExpensesComponent } from "../all-expenses/all-expenses.component";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    NgbNavModule,
    NewExpensesComponent,
    AllExpensesComponent,
],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  providers: [NgbNavConfig]
})
export class NavComponent {
  constructor(config: NgbNavConfig) {
		// customize default values of navs used by this component tree
		config.destroyOnHide = true;
		config.roles = false;
}

}
