import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  // 👇 Template INLINE (sin templateUrl)
  template: `
    <div class="container mt-4">
      <h2>Editar jugador</h2>

      <form *ngIf="playerForm" [formGroup]="playerForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label class="form-label" for="short_name">Nombre corto</label>
          <input id="short_name" class="form-control" formControlName="short_name" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="long_name">Nombre completo</label>
          <input id="long_name" class="form-control" formControlName="long_name" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="age">Edad</label>
          <input id="age" type="number" class="form-control" formControlName="age" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="club_name">Club</label>
          <input id="club_name" class="form-control" formControlName="club_name" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="club_position">Posición</label>
          <input id="club_position" class="form-control" formControlName="club_position" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="fifa_version">Versión FIFA</label>
          <input id="fifa_version" class="form-control" formControlName="fifa_version" />
        </div>

        <button class="btn btn-primary" type="submit" [disabled]="playerForm.invalid">
          Guardar cambios
        </button>

        <a class="btn btn-secondary ms-2" [routerLink]="['/players', playerId]">Cancelar</a>
      </form>

      <div *ngIf="!playerForm" class="mt-3">Cargando formulario...</div>
    </div>
  `,
  // ❌ Sin styleUrls por ahora (para descartar CSS con comentarios mal cerrados)
})
export class PlayerEditComponent implements OnInit {
  playerId!: string;
  playerForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private playersService: PlayersService
  ) {}

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id') || '';

    // Inicializamos el form
    this.playerForm = this.fb.group({
      short_name: ['', Validators.required],
      long_name: [''],
      age: [null, [Validators.required, Validators.min(10)]],
      club_name: [''],
      club_position: [''],
      fifa_version: ['']
    });

    if (this.playerId) {
      this.playersService.getPlayerById(this.playerId).subscribe({
        next: (player) => this.playerForm.patchValue({
          short_name: player.short_name ?? '',
          long_name:  player.long_name ?? '',
          age:        player.age ?? null,
          club_name:  player.club_name ?? '',
          club_position: player.club_position ?? '',
          fifa_version:  player.fifa_version ?? ''
        }),
        error: (e) => console.error('❌ Error cargando jugador', e)
      });
    }
  }

  onSubmit(): void {
    if (this.playerForm.invalid) return;
    this.playersService.updatePlayer(this.playerId, this.playerForm.value).subscribe({
      next: () => this.router.navigate(['/players', this.playerId]),
      error: (e) => console.error('❌ Error actualizando jugador', e)
    });
  }
}
