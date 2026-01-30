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

  /**
   * Truncate title to maximum 20 characters
   */
  get truncatedTitle(): string {
    if (!this.title) return '';
    return this.title.length > 20 ? this.title.substring(0, 20) + '...' : this.title;
  }

  /**
   * Format date to more readable format
   * Example: "2023-04-21T13:53:00Z" -> "April 21st, 2023"
   */
  get formattedDate(): string {
    if (!this.date) return '';
    
    try {
      const date = new Date(this.date);
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      
      // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
      const getOrdinalSuffix = (n: number) => {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      
      return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return this.date; // Return original string if formatting fails
    }
  }
}
