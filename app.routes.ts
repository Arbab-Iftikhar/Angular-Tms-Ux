import { Routes } from '@angular/router';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
export const APP_ROUTES: Routes = [
    {
        path: '',
        redirectTo:"/auth/sign-in",
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: () =>
        import('./authenticate/authenticate.module').then(m => m.AuthenticateModule),
    },
    {
        path: '',
        loadChildren: () =>
        import('./pricing/plan-selector.module').then(m => m.PlanSelectorModule) 
    },
    {
        path:'home',
        component:FullLayoutComponent,
        children: [
            {  
                path: 'load',
                loadChildren: () =>
                import('./load/load.module').then(m => m.LoadModule) 
            },
            {
                path: 'admin',
                loadChildren: () =>
                import('./admin/admin.module').then(m => m.AdminModule) 
            },
            {
                path: 'broker',
                loadChildren: () =>
                import('./broker/broker.module').then(m => m.BrokerModule) 
            },
            {
                path: 'inquiry',
                loadChildren: () =>
                import('./inquiry/inquiry.module').then(m => m.InquiryModule) 
            },

            {
                path: 'settings',
                loadChildren: () =>
                import('./settings/settings.module').then(m => m.SettingsModule) 
            }
            
          ]
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];
