import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() iconPath: string = '';
  @Input() disabled: boolean = false;
  @Input() strokeColor: string = '#222222';
  @Input() backgroundColor: string = 'transparent';
  @Input() width: number = 336; // Default width
  @Input() height: number = 60; // Default height
  @Input() fontSize: number = 22; // Default font size
  @Output() buttonClick = new EventEmitter<void>();

  get svgViewBox(): string {
    return `0 0 ${this.width} ${this.height}`;
  }

  getScaledPath(): string {
    // Original path was designed for 336x60 with rounded corners
    // Scale the coordinates proportionally while preserving curve commands
    const originalWidth = 336;
    const originalHeight = 60;
    const scaleX = this.width / originalWidth;
    const scaleY = this.height / originalHeight;
    
    // The original path uses quadratic Bézier curves for rounded corners
    // We need to scale all coordinates including curve control points
    return `M${8 * scaleX} ${0.5 * scaleY}
            H${328 * scaleX}
            Q${335.5 * scaleX} ${0.5 * scaleY} ${335.5 * scaleX} ${8 * scaleY}
            V${52 * scaleY}
            Q${335.5 * scaleX} ${59.5 * scaleY} ${328 * scaleX} ${59.5 * scaleY}
            H${8 * scaleX}
            Q${0.5 * scaleX} ${59.5 * scaleY} ${0.5 * scaleX} ${52 * scaleY}
            V${8 * scaleY}
            Q${0.5 * scaleX} ${0.5 * scaleY} ${8 * scaleX} ${0.5 * scaleY}Z`;
  }

  get buttonStyles(): { [key: string]: string } {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`,
      'font-size': `${this.fontSize}px`
    };
  }

  get svgStyles(): { [key: string]: string } {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`
    };
  }

  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}