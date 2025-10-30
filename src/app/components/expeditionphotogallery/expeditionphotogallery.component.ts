import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ArrowsChevronRightSmComponent } from '../share/arrows-chevron-right-sm/arrows-chevron-right-sm.component'; 
@Component({
  selector: 'app-expeditionphotogallery',
  imports: [ArrowsChevronRightSmComponent, FormsModule, CommonModule],
  templateUrl: './expeditionphotogallery.component.html',
  styleUrl: './expeditionphotogallery.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpeditionPhotogalleryComponent {

}
