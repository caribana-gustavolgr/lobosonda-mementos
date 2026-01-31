import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, TemplateRef, OnDestroy, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'app-photo-grid-item',
  templateUrl: './photo-grid-item.component.html',
  styleUrls: ['./photo-grid-item.component.scss'],
  standalone: true,
  imports: [CommonModule, OverlayModule, PortalModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGridItemComponent implements OnDestroy {
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

  // ViewChild para el trigger del overlay y el template
  @ViewChild('actionsTrigger') actionsTrigger!: ElementRef;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  // Overlay properties
  overlayRef: OverlayRef | null = null;
  isOverlayOpen: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

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

  onToggleActions(event: Event): void {
    event.stopPropagation();
    
    if (this.overlayRef) {
      this.closeOverlay();
    } else {
      this.openActionsOverlay();
    }
  }

  openActionsOverlay(): void {
    if (!this.actionsTrigger || !this.actionsTemplate) return;

    // Crear posición estratégica para el overlay
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.actionsTrigger)
      .withPositions([
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 8
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -8
        }
      ]);

    // Crear el overlay
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });

    // Crear el portal y adjuntarlo al overlay
    const portal = new TemplatePortal(this.actionsTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    // Escuchar cierre del overlay
    this.overlayRef.backdropClick().subscribe(() => {
      this.closeOverlay();
    });

    this.overlayRef.detachments().subscribe(() => {
      this.overlayRef = null;
      this.isOverlayOpen = false;
      this.cdr.detectChanges();
    });

    this.isOverlayOpen = true;
    this.cdr.detectChanges();
  }

  closeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.isOverlayOpen = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.closeOverlay();
  }

  /**
   * Truncate title to maximum 20 characters
   */
  get truncatedTitle(): string {
    if (!this.title) return '';
    return this.title.length > 20 ? this.title.substring(0, 16) + '...' : this.title;
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
