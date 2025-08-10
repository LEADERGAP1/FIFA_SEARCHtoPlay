import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // 👈 agrega RouterModule
import { CommonModule } from '@angular/common';
import { PlayersService } from '../../services/players.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, NgChartsModule, RouterModule], // 👈 suma RouterModule
  templateUrl: './player-detail.html', // verifica que ESTE sea el archivo que editás
  styleUrls: ['./player-detail.css']
})
export class PlayerDetailComponent implements OnInit {
  playerId!: string;
  player: any = null;

  // 👇 si querés usar el mismo 'route' del constructor en el template, hacelo público:
  constructor(
    public route: ActivatedRoute, // 👈 era private; debe ser public para el template
    private playersService: PlayersService,
    private cdr: ChangeDetectorRef
  ) {}

  radarChartData: ChartConfiguration<'radar'>['data'] = {
    labels: ['Pase', 'Disparo', 'Regate', 'Velocidad', 'Defensa', 'Físico'],
    datasets: [
      {
        data: [],
        label: 'Skill',
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)'
      }
    ]
  };

  radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    elements: { line: { borderWidth: 2 } },
    scales: { r: { beginAtZero: true, min: 0, max: 100 } }
  };

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.loadPlayer();
  }

  loadPlayer(): void {
    this.playersService.getPlayerById(this.playerId).subscribe({
      next: (data) => {
        console.log('🎯 Jugador cargado:', data);
        this.player = data;

        if (this.player?.Skill) {
          this.radarChartData.datasets[0].data = [
            this.player.Skill.passing,
            this.player.Skill.shooting,
            this.player.Skill.dribbling,
            this.player.Skill.pace,
            this.player.Skill.defending,
            this.player.Skill.physicality
          ];
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error al cargar jugador:', err)
    });
  }
}
