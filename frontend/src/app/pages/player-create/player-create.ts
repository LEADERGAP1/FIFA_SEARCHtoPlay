import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-player-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './player-create.html',
  styleUrls: ['./player-create.css']
})
export class PlayerCreateComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private playersService: PlayersService,
    private router: Router
  ) {
    this.form = this.fb.group({
      short_name: ['', Validators.required],
      long_name: [''],
      age: [null, [Validators.required, Validators.min(10)]],
      club_name: [''],
      club_position: [''],
      fifa_version: [''],
      // 🔹 requeridos por tu modelo
      nationality_name: ['', Validators.required],
      fifa_update_date: [this.todayISO(), Validators.required] // YYYY-MM-DD
    });
  }

  private todayISO(): string {
    return new Date().toISOString().slice(0, 10);
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    const raw = this.form.value;
    // Normalizamos tipos/espacios para evitar 500 por validaciones
    const payload = {
      short_name: raw.short_name?.trim(),
      long_name: raw.long_name?.trim() || null,
      age: raw.age != null ? Number(raw.age) : null,
      club_name: raw.club_name?.trim() || null,
      club_position: raw.club_position?.trim() || null,
      // si en DB es INTEGER, usá Number(...) en lugar de String(...)
      fifa_version: raw.fifa_version != null ? String(raw.fifa_version).trim() : null,
      nationality_name: raw.nationality_name?.trim(),
      fifa_update_date: String(raw.fifa_update_date) // YYYY-MM-DD
    };

    this.playersService.createPlayer(payload).subscribe({
      next: (created) => {
        const newId = created?.id ?? created?.player?.id ?? created?.data?.id;
        this.router.navigate(['/players', newId]);
      },
      error: (e) => {
        console.error('❌ Error creando jugador', e?.error || e);
        this.loading = false;
        // opcional: toast/alert con e?.error?.message
      }
    });
  }
}
