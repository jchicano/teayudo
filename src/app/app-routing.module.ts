import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./create-schedule/create-schedule.module').then( m => m.CreateSchedulePageModule)
  },
  {
    path: 'student-modal',
    loadChildren: () => import('./modals/student-modal/student-modal.module').then( m => m.StudentModalPageModule)
  },
  {
    path: 'show',
    loadChildren: () => import('./show/show.module').then( m => m.ShowPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
  /*
  {
    path: 'icons-modal',
    loadChildren: () => import('./modals/icons-modal/icons-modal.module').then( m => m.IconsModalPageModule)
  }
  {
    path: 'colors-modal',
    loadChildren: () => import('./modals/colors-modal/colors-modal.module').then( m => m.ColorsModalPageModule)
  }
  */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
