import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instagram',
  standalone: true,
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstagramComponent {
  @Input() size: '20' | '24' | '32' | '40' | '48' | '16' = '48';
}

