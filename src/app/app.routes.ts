import { Routes } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

export const routes: Routes = [
    { path: 'home', component: NavComponent },

    { path: '', component: NavComponent },
];
