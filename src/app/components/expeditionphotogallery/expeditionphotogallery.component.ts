import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from '../share/button/button.component'; 
import { ArrowsChevronLeftComponent } from "../share/arrows-chevron-left/arrows-chevron-left.component";
@Component({
  selector: 'app-expeditionphotogallery',
  imports: [FormsModule, CommonModule, ButtonComponent, ArrowsChevronLeftComponent],
  templateUrl: './expeditionphotogallery.component.html',
  styleUrls: ['../../../styles.scss','./expeditionphotogallery.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpeditionPhotogalleryComponent {

  onUploadPhotosClick(): void {
    console.log('Upload Photo clicked!');
    // Aquí puedes agregar la lógica para abrir la galería de fotos
    console.log('Test edit - funcionando correctamente');
  }
}
