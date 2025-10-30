import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PhotoFromMyPhoneComponent } from "../photo-from-my-phone/photo-from-my-phone.component";
@Component({
  selector: "app-uploadphoto",
  templateUrl: "./uploadphoto.component.html",
  styleUrls: ["./uploadphoto.component.scss"],
  standalone: true,
  imports: [PhotoFromMyPhoneComponent, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadphotoComponent {}