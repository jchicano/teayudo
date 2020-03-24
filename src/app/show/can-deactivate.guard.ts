import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { IDeactivatableComponent } from '../utils/deactivatable-component.interface';

// NOTE https://ionicthemes.com/tutorials/about/ionic-navigation-and-routing-ultimate-guide
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<IDeactivatableComponent> {
    canDeactivate(
        component: IDeactivatableComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return component.canDeactivate();
    }
}