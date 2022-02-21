import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([{ path: 'about', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule) }]),
  Shell.childRoutes([
    {
      path: 'pluginmanager',
      loadChildren: () => import('./pluginmanager/pluginmanager.module').then((m) => m.PluginmanagerModule),
    },
  ]),
  Shell.childRoutes([
    {
      path: 'visualization',
      loadChildren: () => import('./visualization/visualization.module').then((m) => m.VisualizationModule),
    },
  ]),

  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
