import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-grid-item',
  templateUrl: './photo-grid-item.component.html',
  styleUrls: ['./photo-grid-item.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGridItemComponent {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() date: string = '';
  @Input() canBePurchased: boolean = false;
  @Input() photoId: string = '';
  @Input() isOwnPhoto: boolean = false;

  @Output() photoSelected = new EventEmitter<string>();
  @Output() purchaseClicked = new EventEmitter<string>();
  @Output() editClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();

  onSelectPhoto(): void {
    this.photoSelected.emit(this.photoId);
  }

  onPurchaseClick(event: Event): void {
    event.stopPropagation();
    this.purchaseClicked.emit(this.photoId);
  }

  onEditClick(event: Event): void {
    event.stopPropagation();
    this.editClicked.emit(this.photoId);
  }

  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteClicked.emit(this.photoId);
  }
}
