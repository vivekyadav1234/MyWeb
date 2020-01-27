import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { PagenotfoundComponent} from './pagenotfound.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '**',
                component: PagenotfoundComponent
            }
        ])
    ],
    declarations: [
        PagenotfoundComponent
    ],
    exports: [
        RouterModule
    ]
})
export class PagenotfoundRoutingModule { }