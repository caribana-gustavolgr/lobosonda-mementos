import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brands-facebook',
  standalone: true,
  templateUrl: './brands-facebook.component.html',
  styleUrls: ['./brands-facebook.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandsFacebookComponent {}
