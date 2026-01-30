import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface PhotoFile {
  file: File;
  base64: string;
  filename: string;
  size: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoPickerService {

  constructor() {}

  /**
   * Open file picker to select photos from device
   * @param multiple Allow multiple file selection
   * @param acceptTypes Accepted file types (default: images)
   * @returns Observable with selected photos
   */
  selectPhotos(multiple: boolean = false, acceptTypes: string = 'image/*'): Observable<PhotoFile[]> {
    return from(new Promise<PhotoFile[]>((resolve, reject) => {
      // Create input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = acceptTypes;
      input.multiple = multiple;

      input.onchange = (event: any) => {
        const files = event.target.files as FileList;
        if (!files || files.length === 0) {
          resolve([]);
          return;
        }

        const photoPromises: Promise<PhotoFile>[] = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          photoPromises.push(this.convertFileToPhoto(file));
        }

        Promise.all(photoPromises)
          .then(photos => resolve(photos))
          .catch(error => reject(error));
      };

      input.oncancel = () => {
        resolve([]);
      };

      // Trigger file picker
      input.click();
    }));
  }

  /**
   * Convert a File object to PhotoFile with base64
   * @param file The file to convert
   * @returns Promise with PhotoFile object
   */
  private convertFileToPhoto(file: File): Promise<PhotoFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data:image/...;base64, prefix if needed
        const cleanBase64 = base64.split(',')[1] || base64;
        
        resolve({
          file: file,
          base64: cleanBase64,
          filename: file.name,
          size: file.size,
          type: file.type
        });
      };
      
      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Take photo using device camera (if available)
   * @returns Observable with captured photo
   */
  takePhoto(): Observable<PhotoFile> {
    return from(new Promise<PhotoFile>((resolve, reject) => {
      // Create input element for camera
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use rear camera if available

      input.onchange = (event: any) => {
        const files = event.target.files as FileList;
        if (!files || files.length === 0) {
          reject(new Error('No photo captured'));
          return;
        }

        this.convertFileToPhoto(files[0])
          .then(photo => resolve(photo))
          .catch(error => reject(error));
      };

      input.oncancel = () => {
        reject(new Error('Camera capture cancelled'));
      };

      // Trigger camera
      input.click();
    }));
  }

  /**
   * Validate photo file
   * @param photo PhotoFile to validate
   * @param maxSizeMB Maximum file size in MB (default: 50MB)
   * @returns Validation result
   */
  validatePhoto(photo: PhotoFile, maxSizeMB: number = 50): { valid: boolean; error?: string } {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (photo.size > maxSizeBytes) {
      return { 
        valid: false, 
        error: `File size (${(photo.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)` 
      };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(photo.type.toLowerCase())) {
      return { 
        valid: false, 
        error: `File type ${photo.type} is not supported. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }

    return { valid: true };
  }
}
