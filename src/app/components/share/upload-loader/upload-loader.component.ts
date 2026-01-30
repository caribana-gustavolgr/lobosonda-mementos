import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-loader',
  templateUrl: './upload-loader.component.html',
  styleUrls: ['./upload-loader.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadLoaderComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = 'Uploading photos...';
  @Input() progress: number = 0; // 0-100
  @Input() showProgress: boolean = false;

  get progressPercentage(): string {
    return `${this.progress}%`;
  }
}
