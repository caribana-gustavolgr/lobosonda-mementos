import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from '../share/button/button.component';
import { PhotoGridItemComponent } from "../share/photo-grid-item/photo-grid-item.component";
import { ArrowsChevronLeftComponent } from "../share/arrows-chevron-left/arrows-chevron-left.component";

// Interface para los datos de fotos
interface PhotoData {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  canBePurchased: boolean;
  isOwnPhoto: boolean;
}

@Component({
  selector: 'app-expeditionphotogallery',
  imports: [FormsModule, CommonModule, ButtonComponent, PhotoGridItemComponent, ArrowsChevronLeftComponent],
  templateUrl: './expeditionphotogallery.component.html',
  styleUrls: ['../../../styles.scss','./expeditionphotogallery.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpeditionPhotogalleryComponent {
  // Datos de ejemplo para el grid de fotos
  photos: PhotoData[] = [
    {
      id: 'photo-1',
      imageUrl: 'https://storage.googleapis.com/lobosondaphotos.appspot.com/_DSC5423.JPG-thumbnail-1766405330417',
      title: 'Quirico Faustino',
      date: '16 April 2025 13:53',
      canBePurchased: false,
      isOwnPhoto: false
    },
    {
      id: 'photo-2',
      imageUrl: 'https://storage.googleapis.com/lobosondaphotos.appspot.com/_DSC5423.JPG-thumbnail-1766405330417',
      title: 'Leodigisio Liuva',
      date: '16 April 2025 13:53',
      canBePurchased: true,
      isOwnPhoto: false
    },
    {
      id: 'photo-3',
      imageUrl: 'https://storage.googleapis.com/lobosondaphotos.appspot.com/_DSC5423.JPG-thumbnail-1766405330417',
      title: 'Marina Silva',
      date: '16 April 2025 15:30',
      canBePurchased: true,
      isOwnPhoto: true
    },
    {
      id: 'photo-4',
      imageUrl: 'https://storage.googleapis.com/lobosondaphotos.appspot.com/_DSC5423.JPG-thumbnail-1766405330417',
      title: 'Carlos Rodriguez',
      date: '16 April 2025 16:45',
      canBePurchased: false,
      isOwnPhoto: true
    }
  ];

  onUploadPhotosClick(): void {
    console.log('Upload Photo clicked!');
    // Aquí puedes agregar la lógica para abrir la galería de fotos
    console.log('Test edit - funcionando correctamente');
  }

  onPhotoSelected(photoId: string): void {
    console.log('Photo selected:', photoId);
    // Lógica para pre-visualizar la foto
  }

  onPurchaseClicked(photoId: string): void {
    console.log('Purchase clicked for photo:', photoId);
    // Lógica para iniciar el proceso de compra
  }

  onEditClicked(photoId: string): void {
    console.log('Edit clicked for photo:', photoId);
    // Lógica para editar la foto
  }

  onDeleteClicked(photoId: string): void {
    console.log('Delete clicked for photo:', photoId);
    // Lógica para eliminar la foto
  }
}
