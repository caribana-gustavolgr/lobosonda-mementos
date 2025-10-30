import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsFacebookComponent } from '../brands-facebook/brands-facebook.component';

@Component({
  selector: 'app-facebook',
  standalone: true,
  imports: [BrandsFacebookComponent, CommonModule],
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacebookComponent {
  @Input() property1: 'Default' | 'Variant2' = 'Default';
}
