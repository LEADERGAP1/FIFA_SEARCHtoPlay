import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common'; // 👈 Añadido NgIf, NgFor
import { PlayersService } from '../../services/players.service';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, // 👈 Esto soluciona el problema con routerLink
    NgIf,
    NgFor // 👈 necesarios para que VS Code no tache el *ngIf y *ngFor
  ],
  templateUrl: './players.html',
  styleUrls: ['./players.css']
})
export class PlayersComponent implements OnInit {
  players: any[] = [];
  filtersForm!: FormGroup;

  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  constructor(
    private playersService: PlayersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      name: [''],
      club: [''],
      position: [''],
      version: ['']
    });

    this.fetchPlayers();
  }

  fetchPlayers(): void {
    const filters = {
      ...this.filtersForm.value,
      page: this.currentPage,
      limit: this.limit
    };

    this.playersService.getPlayers(filters).subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos:', data);
        this.players = data.players;
        this.totalPages = data.pages;
      },
      error: (err) => {
        console.error('❌ Error al cargar jugadores:', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchPlayers();
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.currentPage = 1;
    this.fetchPlayers();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchPlayers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchPlayers();
    }
  }

  downloadCSV(): void {
    const filters = this.filtersForm.value;

    this.playersService.downloadCSV(filters).subscribe({
      next: (blob) => {
        saveAs(blob, 'jugadores.csv');
      },
      error: (err) => {
        console.error('❌ Error al descargar CSV:', err);
      }
    });
  }
}
