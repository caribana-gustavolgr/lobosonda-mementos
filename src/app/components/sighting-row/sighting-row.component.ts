import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sighting-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sighting-row.component.html',
  styleUrl: './sighting-row.component.scss'
})
export class SightingRowComponent {
  @Input() speciesName: string = '';
  @Input() speciesDescription: string = '';
  @Input() speciesIcon: string = '';
}
