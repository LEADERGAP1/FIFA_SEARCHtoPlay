import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { PlayersComponent } from './pages/players/players';
import { PlayerDetailComponent } from './pages/player-detail/player-detail';
import { PlayerEditComponent } from './pages/player-edit/player-edit';
import { PlayerCreateComponent } from './pages/player-create/player-create'; // 👈 importar create
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  // Listado
  { path: 'players', component: PlayersComponent, canActivate: [authGuard] },

  // Crear (antes que :id para no chocar)
  { path: 'players/create', component: PlayerCreateComponent, canActivate: [authGuard] }, // 👈 acá

  // Detalle
  { path: 'players/:id', component: PlayerDetailComponent, canActivate: [authGuard] },

  // Editar
  { path: 'players/:id/edit', component: PlayerEditComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
