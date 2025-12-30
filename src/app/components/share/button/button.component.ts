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
  @Output() buttonClick = new EventEmitter<void>();
 
  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}